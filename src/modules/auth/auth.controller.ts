import { Body, Controller, Get, Post, Request } from '@nestjs/common'
import { JwtAuth } from '../../decorators/jwt-auth.decorator'
import { LocalAuth } from '../../decorators/local-auth.decorator'
import { User } from '../users/models/user.model'
import { AuthService } from './services/auth.service'
import { TokenRefreshDto } from './dto/token-refresh.dto'
import { UserCreateDto } from './dto/user-create.dto'
import { TokensService } from './services/tokens.service'

@Controller('api/auth')
export class AuthController {
	constructor(private readonly authService: AuthService, private readonly tokensService: TokensService) {}

	@LocalAuth()
	@Post('login')
	async login(@Request() req): Promise<{ accessToken: string; refreshToken: string }> {
		return this.authService.getAccessAndRefreshTokens(req.user)
	}

	@Post('register')
	async register(@Body() userDto: UserCreateDto): Promise<User> {
		return this.authService.register({
			firstName: userDto.firstName,
			lastName: userDto.lastName,
			email: userDto.email,
			password: userDto.password
		})
	}

	@Post('refresh')
	async refresh(
		@Body() data: TokenRefreshDto
	): Promise<{ message: string; accessToken: string; refreshToken: string }> {
		const { accessToken, refreshToken } = await this.tokensService.createAccessTokenFromRefreshToken(data.refreshToken)

		// TODO: Grab refresh token from httpOnly cookie instead of from request body

		return {
			message: 'success',
			accessToken,
			refreshToken
		}
	}

	//TODO: Remove this test endpoint when authentication implementation is complete
	@JwtAuth()
	@Get('test')
	async testEndpoint(@Request() req, @Body() data: any) {
		return req.user
	}
}
