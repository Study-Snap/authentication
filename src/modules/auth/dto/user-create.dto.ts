import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator'

export class UserCreateDto {
	@ApiProperty({ default: 'user@example.com' })
	@IsString()
	@IsNotEmpty({ message: 'An email is required' })
	@IsEmail()
	email: string

	@ApiProperty({ default: 'password123' })
	@IsString()
	@IsNotEmpty({ message: 'A password is required' })
	@MinLength(6, { message: 'Your password must be at least 6 characters long' })
	password: string

	@ApiProperty({ default: 'John' })
	@IsString()
	@IsNotEmpty({ message: 'We require your first name to sign you up' })
	firstName: string

	@ApiProperty({ default: 'Smith' })
	@IsString()
	@IsNotEmpty({ message: 'We require your last name to sign you up' })
	lastName: string
}
