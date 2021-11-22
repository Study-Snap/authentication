import { Body, Controller, Get, HttpStatus, Post, Put, Req, Request } from '@nestjs/common'
import { JwtAuth } from '../../common/decorators/jwt-auth.decorator'
import { LocalAuth } from '../../common/decorators/local-auth.decorator'
import { User } from '../users/models/user.model'
import { AuthService } from './services/auth.service'
import { UserCreateDto } from './dto/user-create.dto'
import { TokensService } from './services/tokens.service'
import { Cookies } from '../../common/decorators/cookies.decorator'
import { ApiBody, ApiResponse, ApiTags, ApiHeader } from '@nestjs/swagger'
import { UserLoginDto } from '../../common/docs/types/user-login.doc.type'
import { UserUpdatePasswdDto } from './dto/user-update-passwd.dto'
import { AccessPairs } from './types/access-pairs.type'

@ApiTags('auth')
@Controller('')
export class AuthController {
	constructor(private readonly authService: AuthService, private readonly tokensService: TokensService) {}

	@ApiBody({ type: UserLoginDto, description: 'Enters a email and password combination as a JSON body' })
	@ApiResponse({ status: HttpStatus.OK, description: 'An access token and refresh token pair', type: AccessPairs })
	@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Incorrect email or password' })
	@LocalAuth()
	@Post('login')
	async login(@Request() req): Promise<AccessPairs> {
		return this.authService.getAccessAndRefreshTokens(req.user)
	}

	@ApiResponse({ status: HttpStatus.CREATED, description: 'User account details that have been created', type: User })
	@Post('register')
	async register(@Body() userDto: UserCreateDto): Promise<User> {
		return this.authService.register({
			firstName: userDto.firstName,
			lastName: userDto.lastName,
			email: userDto.email,
			password: userDto.password
		})
	}

	@ApiBody({
		type: UserUpdatePasswdDto,
		description: 'Provides details required to change the users password',
		required: true
	})
	@ApiResponse({
		description: 'The updated user ... NOTE: nothing visible will change since password is hidden from response.',
		status: HttpStatus.OK,
		type: User
	})
	@JwtAuth()
	@Put('password')
	async changePassword(@Request() req, @Body() data: UserUpdatePasswdDto): Promise<User> {
		return this.authService.updatePassword(req.user.id, data.password, data.newPassword)
	}

	@ApiHeader({
		name: 'cookie',
		description: 'refreshToken=`<token>`; Path=/; Domain=localhost; HttpOnly; Expires=Tue, 08 Feb 2080 18:25:59 GMT;'
	})
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'Response with new access token (`accessToken`) and refresh token (`refreshToken`)'
	})
	@Post('refresh')
	async refresh(@Cookies('refreshToken') token: string): Promise<AccessPairs> {
		// Retrieve the new access token and refresh tokens (using token passed through httpOnly cookie)
		const { accessToken, refreshToken } = await this.tokensService.createAccessTokenFromRefreshToken(token)

		return {
			accessToken,
			refreshToken
		}
	}

	@ApiHeader({ name: 'Authorization', description: 'Bearer `<token>`' })
	@ApiResponse({ status: HttpStatus.OK, description: 'User ID and Email associated with the token' })
	@JwtAuth()
	@Get('test')
	async testEndpoint(@Request() req) {
		return req.user
	}
}
