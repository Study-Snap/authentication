import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsEmail, MinLength, MaxLength } from 'class-validator'

/**
 * Data transfer opject for updating a user password
 */
export class UserUpdatePasswdDto {
	@ApiProperty({ description: 'The users current password to validate the change', default: 'password123' })
	@IsString()
	@IsNotEmpty({ message: 'A password is required to modify any user information' })
	password: string

	@ApiProperty({ description: 'A new password to use for the user', default: 'abc12345' })
	@IsString()
	@MinLength(6, { message: 'Your password must be at least 6 characters long' })
	@MaxLength(32, { message: 'Your password is too long. It should be less than 32 characters' })
	newPassword: string
}
