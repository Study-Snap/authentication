import { Body, Controller, Post, Request } from '@nestjs/common'
import { LocalAuth } from 'src/decorators/local-auth.decorator'
import { User } from '../users/models/user.model'
import { AuthService } from './auth.service'
import { UserCreateDto } from './dto/user-create.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

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
}
