import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

/**
 * Describes the pairs of access and refresh tokens sent to a user and used for stateless authentication and refresh
 */
export class AccessPairs {
	@ApiProperty()
	@IsString()
	accessToken: string

	@ApiProperty()
	@IsString()
	refreshToken: string
}
