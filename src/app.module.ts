import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Dialect } from 'sequelize/types'
import { getConfig } from './config'
import { IConfigAttributes } from './interfaces/config/auth-config.interface'

// Get App Config
const config: IConfigAttributes = getConfig()

@Module({
	imports: [
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
