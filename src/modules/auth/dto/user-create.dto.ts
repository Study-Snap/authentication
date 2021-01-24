import { IsNotEmpty, IsString, IsEmail } from 'class-validator'

export class UserCreateDto {
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string

	@IsString()
	@IsNotEmpty()
	password: string

	@IsString()
	@IsNotEmpty()
	firstName: string

	@IsString()
	@IsNotEmpty()
	lastName: string
}
