import { ApiProperty } from '@nestjs/swagger'

export class UserLoginDto {
	@ApiProperty({ default: 'user@example.com' })
	email: string
	@ApiProperty({ default: 'password123' })
	password: string
}
