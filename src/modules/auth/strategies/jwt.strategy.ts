import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { getConfig } from '../../../config'
import { JWT_STRATEGY } from '../../../common/constants'
import { IConfigAttributes } from '../../../common/interfaces/config/app-config.interface'

const config: IConfigAttributes = getConfig()

/**
 * JWT Authentication strategy
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.jwtSecret
		})
	}

	/**
	 * Validates and retrieves stored data from the provided JWT authentication header
	 * @param payload The JWT payload
	 * @returns User data encoded in the JWT payload
	 */
	async validate(payload: any) {
		return {
			id: payload.sub,
			email: payload.email
		}
	}
}
