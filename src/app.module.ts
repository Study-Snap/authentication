import { TokensService } from './modules/auth/services/tokens.service'
import { RefreshTokensModule } from './modules/refresh-tokens/refresh-tokens.module'
import { UsersModule } from './modules/users/users.module'
import { AuthModule } from './modules/auth/auth.module'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Dialect } from 'sequelize/types'
import { getConfig } from './config'
import { IConfigAttributes } from './interfaces/config/app-config.interface'

// Get App Config
const config: IConfigAttributes = getConfig()

@Module({
	imports: [
		RefreshTokensModule,
		UsersModule,
		AuthModule,
		SequelizeModule.forRoot({
			dialect: config.dbDialect as Dialect,
			host: config.dbHost,
			port: config.dbPort as number,
			database: config.dbUserDatabase,
			username: config.dbUsername,
			password: config.dbPassword,
			retryAttempts: config.dbRetryAttempts as number,
			autoLoadModels: true,
			synchronize: true,
			models: []
		})
	],
	controllers: [],
	providers: []
})
export class AppModule {}
