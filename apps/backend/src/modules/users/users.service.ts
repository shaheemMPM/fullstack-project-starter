import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { NewUser, User } from '@/db';
import { db, users } from '@/db';

@Injectable()
export class UsersService {
	// Get all users
	async findAll(): Promise<User[]> {
		return await db.query.users.findMany();
	}

	// Get user by ID (Relational query - Prisma-like)
	async findOne(id: number): Promise<User | undefined> {
		return await db.query.users.findFirst({
			where: eq(users.id, id),
		});
	}

	// Get user by email
	async findByEmail(email: string): Promise<User | undefined> {
		return await db.query.users.findFirst({
			where: eq(users.email, email),
		});
	}

	// Create new user
	async create(newUser: NewUser): Promise<User> {
		const [user] = await db.insert(users).values(newUser).returning();
		return user;
	}

	// Update user
	async update(id: number, userData: Partial<NewUser>): Promise<User> {
		const [user] = await db
			.update(users)
			.set({ ...userData, updatedAt: new Date() })
			.where(eq(users.id, id))
			.returning();
		return user;
	}

	// Delete user
	async remove(id: number): Promise<void> {
		await db.delete(users).where(eq(users.id, id));
	}
}
