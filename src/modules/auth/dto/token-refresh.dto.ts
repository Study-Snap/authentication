import { IsNotEmpty, IsString } from 'class-validator'

export class TokenRefreshDto {
	@IsNotEmpty({ message: 'You must provide a refresh token' })
	@IsString()
	refreshToken: string
}
