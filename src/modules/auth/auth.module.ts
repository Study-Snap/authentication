import { AuthController } from './../auth.controller'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { getConfig } from 'src/config'
import { IConfigAttributes } from 'src/interfaces/config/app-config.interface'
import { RefreshTokensModule } from '../refresh-tokens/refresh-tokens.module'
import { RefreshTokensRepository } from '../refresh-tokens/refresh-tokens.repository'
import { UsersModule } from '../users/users.module'
import { UsersRepository } from '../users/users.repository'
import { TokensService } from './tokens.service'

// Configuration for Auth
const config: IConfigAttributes = getConfig()

@Module({
	imports: [
		UsersModule,
		RefreshTokensModule,
		PassportModule,
		JwtModule.register({
			secret: config.jwtSecret,
			signOptions: {
				expiresIn: config.jwtAccessExpireTime
			}
		})
	],
	controllers: [
		AuthController
	],
	providers: [
		UsersRepository,
		RefreshTokensRepository,
		TokensService
	]
})
export class AuthModule {}
