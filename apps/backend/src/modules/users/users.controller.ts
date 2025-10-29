import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
} from '@nestjs/common';
import type { NewUser, User } from '@/db';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	async findAll(): Promise<User[]> {
		return await this.usersService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<User | undefined> {
		return await this.usersService.findOne(Number.parseInt(id, 10));
	}

	@Post()
	async create(@Body() newUser: NewUser): Promise<User> {
		return await this.usersService.create(newUser);
	}

	@Put(':id')
	async update(
		@Param('id') id: string,
		@Body() userData: Partial<NewUser>
	): Promise<User> {
		return await this.usersService.update(Number.parseInt(id, 10), userData);
	}

	@Delete(':id')
	async remove(@Param('id') id: string): Promise<void> {
		return await this.usersService.remove(Number.parseInt(id, 10));
	}
}
