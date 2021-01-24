import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator'

export class UserCreateDto {
	@IsString()
	@IsNotEmpty({ message: 'An email is required' })
	@IsEmail()
	email: string

	@IsString()
	@IsNotEmpty({ message: 'A password is required' })
	@MinLength(6, { message: 'Your password must be at least 6 characters long' })
	password: string

	@IsString()
	@IsNotEmpty({ message: 'We require your first name to sign you up' })
	firstName: string

	@IsString()
	@IsNotEmpty({ message: 'We require your last name to sign you up' })
	lastName: string
}
