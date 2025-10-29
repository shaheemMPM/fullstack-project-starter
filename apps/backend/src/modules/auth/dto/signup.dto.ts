import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class SignupDto {
	@IsEmail()
	email: string;

	@IsString()
	@MinLength(8)
	password: string;

	@IsString()
	@IsOptional()
	name?: string;
}
