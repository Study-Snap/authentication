import { DEVELOPMENT, PRODUCTION, TEST } from '../constants'
import { IConfig } from '../interfaces/config/app-config.interface'
import * as dotenv from 'dotenv'
dotenv.config()

const appConfig: IConfig = {
	development: {
		listenPort: process.env.PORT || 5555,
		maxRequests: parseInt(process.env.MAX_REQUESTS) || 250,
		bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS || 12,
		dbDialect: process.env.DB_DIALECT || 'postgres',
		dbHost: process.env.DB_HOST || 'localhost',
		dbPort: process.env.DB_PORT || 5432,
		dbUsername: process.env.DB_USER,
		dbPassword: process.env.DB_PASS,
		dbUserDatabase: process.env.DB_USER_DATABASE || 'studysnap_db',
		dbRetryAttempts: process.env.DB_RETRY_ATTEMPTS || 2,
		jwtSecret: process.env.JWT_SECRET || 'dev_secret_do_change_in_prod',
		jwtAccessExpireTime: process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME || '20s'
	},
	test: {
		listenPort: process.env.PORT || 5555,
		maxRequests: 999,
		maxRequests: parseInt(process.env.MAX_REQUESTS) || 250,
		bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS || 12,
		dbDialect: process.env.DB_DIALECT || 'postgres',
		dbHost: process.env.DB_HOST || 'localhost',
		dbPort: process.env.DB_PORT || 7654,
		dbUsername: process.env.DB_USER,
		dbPassword: process.env.DB_PASS,
		dbUserDatabase: process.env.DB_USER_DATABASE || 'studysnap_testdb',
		dbRetryAttempts: process.env.DB_RETRY_ATTEMPTS || 2,
		jwtSecret: process.env.JWT_SECRET || 'test_secret',
		jwtAccessExpireTime: '10h'
	},
	production: {
		listenPort: process.env.PORT || 5555,
		maxRequests: parseInt(process.env.MAX_REQUESTS) || 250,
		bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS || 12,
		dbDialect: process.env.DB_DIALECT || 'postgres',
		dbHost: process.env.DB_HOST,
		dbPort: process.env.DB_PORT || 5432,
		dbUsername: process.env.DB_USER,
		dbPassword: process.env.DB_PASS,
		dbUserDatabase: process.env.DB_USER_DATABASE || 'studysnap_db',
		dbRetryAttempts: process.env.DB_RETRY_ATTEMPTS || 5,
		jwtSecret: process.env.JWT_SECRET,
		jwtAccessExpireTime: process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME || '10m'
	}
}

export const getConfig = () => {
	switch (process.env.NODE_ENV) {
		case DEVELOPMENT:
			return appConfig.development
		case TEST:
			return appConfig.test
		case PRODUCTION:
			return appConfig.production
		default:
			return appConfig.development
	}
}
