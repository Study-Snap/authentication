import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { LOCAL_STRATEGY } from 'src/constants'
import { User } from 'src/modules/users/models/user.model'
import { AuthService } from '../services/auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, LOCAL_STRATEGY) {
	constructor(private readonly authService: AuthService) {
		super({
			usernameField: 'email',
			passwordField: 'password',
			session: false
		})
	}

	async validate(email: string, password: string): Promise<User> {
		return this.authService.validate(email, password)
	}
}
