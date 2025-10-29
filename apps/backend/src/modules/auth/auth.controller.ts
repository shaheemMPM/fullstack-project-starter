import { Body, Controller, Post, Get, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { AuthResponse } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Public } from './decorators/public.decorator';
import {
	CurrentUser,
	type CurrentUserData,
} from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Post('signup')
	async signup(@Body() signupDto: SignupDto): Promise<AuthResponse> {
		return await this.authService.signup(signupDto);
	}

	@Public()
	@Post('login')
	async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
		return await this.authService.login(loginDto);
	}

	@Get('me')
	async getMe(@CurrentUser() user: CurrentUserData) {
		return {
			id: user.userId,
			email: user.email,
		};
	}

	@Put('change-password')
	async changePassword(
		@CurrentUser() user: CurrentUserData,
		@Body() changePasswordDto: ChangePasswordDto,
	): Promise<{ message: string }> {
		await this.authService.changePassword(user.userId, changePasswordDto);
		return { message: 'Password changed successfully' };
	}
}
