import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { getConfig } from 'src/config'
import { JWT_STRATEGY } from 'src/constants'
import { IConfigAttributes } from 'src/interfaces/config/app-config.interface'

const config: IConfigAttributes = getConfig()

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.jwtSecret
		})
	}

	async validate(payload: any) {
		return {
			id: payload.sub,
			email: payload.email
		}
	}
}
