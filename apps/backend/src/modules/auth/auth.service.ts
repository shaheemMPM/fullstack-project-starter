import type { User } from '@db';
import { db, users } from '@db';
import {
	ConflictException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import type { AuthResponse, JwtPayload } from './auth.types';
import type { ChangePasswordDto } from './dto/change-password.dto';
import type { LoginDto } from './dto/login.dto';
import type { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
	constructor(private jwtService: JwtService) {}

	async signup(signupDto: SignupDto): Promise<AuthResponse> {
		// Check if user already exists
		const existingUser = await db.query.users.findFirst({
			where: eq(users.email, signupDto.email),
		});

		if (existingUser) {
			throw new ConflictException('Email already registered');
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(signupDto.password, 10);

		// Create user
		const [newUser] = await db
			.insert(users)
			.values({
				email: signupDto.email,
				password: hashedPassword,
				name: signupDto.name,
			})
			.returning();

		// Generate JWT
		const accessToken = await this.generateToken(newUser);

		return {
			access_token: accessToken,
			user: {
				id: newUser.id,
				email: newUser.email,
				name: newUser.name,
			},
		};
	}

	async login(loginDto: LoginDto): Promise<AuthResponse> {
		// Find user
		const user = await db.query.users.findFirst({
			where: eq(users.email, loginDto.email),
		});

		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		// Verify password
		const isPasswordValid = await bcrypt.compare(
			loginDto.password,
			user.password,
		);

		if (!isPasswordValid) {
			throw new UnauthorizedException('Invalid credentials');
		}

		// Generate JWT
		const accessToken = await this.generateToken(user);

		return {
			access_token: accessToken,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
			},
		};
	}

	async changePassword(
		userId: number,
		changePasswordDto: ChangePasswordDto,
	): Promise<void> {
		// Get user
		const user = await db.query.users.findFirst({
			where: eq(users.id, userId),
		});

		if (!user) {
			throw new UnauthorizedException('User not found');
		}

		// Verify current password
		const isPasswordValid = await bcrypt.compare(
			changePasswordDto.currentPassword,
			user.password,
		);

		if (!isPasswordValid) {
			throw new UnauthorizedException('Current password is incorrect');
		}

		// Hash new password
		const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

		// Update password
		await db
			.update(users)
			.set({ password: hashedPassword, updatedAt: new Date() })
			.where(eq(users.id, userId));
	}

	private async generateToken(user: User): Promise<string> {
		const payload: JwtPayload = {
			sub: user.id,
			email: user.email,
		};

		return await this.jwtService.signAsync(payload);
	}
}
