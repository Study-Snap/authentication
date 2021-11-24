import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { LOCAL_STRATEGY } from '../../../common/constants'
import { User } from '../../../modules/users/models/user.model'
import { AuthService } from '../services/auth.service'

/**
 * Local authentication (user/password, email/password) strategy
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, LOCAL_STRATEGY) {
	constructor(private readonly authService: AuthService) {
		super({
			usernameField: 'email',
			passwordField: 'password',
			session: false
		})
	}

	/**
	 * Validates and retrieves user information provided a username and password
	 * @param email Users email
	 * @param password Users password
	 * @returns A valid user object for the user being validated (iff credentials are indeed valid)
	 */
	async validate(email: string, password: string): Promise<User> {
		return this.authService.validate(email, password)
	}
}
