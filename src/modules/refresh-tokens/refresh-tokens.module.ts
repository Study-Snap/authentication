import { RefreshTokensRepository } from './refresh-tokens.repository'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { RefreshToken } from './models/refresh-token.model'

@Module({
	imports: [
		SequelizeModule.forFeature([
			RefreshToken
		])
	],
	controllers: [],
	providers: [
		RefreshTokensRepository
	],
	exports: [
		SequelizeModule
	]
})
export class RefreshTokensModule {}
