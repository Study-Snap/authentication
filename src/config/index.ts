import { DEVELOPMENT, PRODUCTION, TEST } from '../common/constants'
import { IConfig } from '../common/interfaces/config/app-config.interface'
import * as dotenv from 'dotenv'

// Import env vars from appropriate file
switch (process.env.NODE_ENV) {
	case DEVELOPMENT:
		dotenv.config({ path: '.dev.env' })
		break
	case TEST:
		dotenv.config({ path: '.test.env' })
	case PRODUCTION:
		dotenv.config({ path: '.prod.env' })
	default:
		dotenv.config()
		break
}

const appConfig: IConfig = {
	development: {
		listenPort: process.env.PORT || 5555,
		maxRequests: parseInt(process.env.MAX_REQUESTS) || 250,
		bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,
		dbDialect: process.env.DB_DIALECT || 'postgres',
		dbHost: process.env.DB_HOST || 'localhost',
		dbPort: process.env.DB_PORT || 5432,
		dbUsername: process.env.DB_USER,
		dbPassword: process.env.DB_PASS,
		dbDatabaseName: process.env.DB_DATABASE_NAME || 'studysnap_db',
		dbRetryAttempts: parseInt(process.env.DB_RETRY_ATTEMPTS) || 2,
		jwtSecret: process.env.JWT_SECRET || 'dev_secret_do_change_in_prod',
		jwtAccessExpireTime: process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME || '20m'
	},
	test: {
		listenPort: process.env.PORT || 5000,
		maxRequests: 999,
		bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,
		dbDialect: process.env.DB_DIALECT || 'postgres',
		dbHost: process.env.DB_HOST || 'localhost',
		dbPort: process.env.DB_PORT || 7654,
		dbUsername: process.env.DB_USER || 'studysnap',
		dbPassword: process.env.DB_PASS || 'snapstudy',
		dbDatabaseName: process.env.DB_DATABASE_NAME || 'studysnap_db',
		dbRetryAttempts: parseInt(process.env.DB_RETRY_ATTEMPTS) || 2,
		jwtSecret: process.env.JWT_SECRET || 'test_secret',
		jwtAccessExpireTime: '10h'
	},
	production: {
		listenPort: process.env.PORT || 5555,
		maxRequests: parseInt(process.env.MAX_REQUESTS) || 250,
		bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,
		dbDialect: process.env.DB_DIALECT || 'postgres',
		dbHost: process.env.DB_HOST,
		dbPort: process.env.DB_PORT || 5432,
		dbUsername: process.env.DB_USER,
		dbPassword: process.env.DB_PASS,
		dbDatabaseName: process.env.DB_DATABASE_NAME || 'studysnap_db',
		dbRetryAttempts: parseInt(process.env.DB_RETRY_ATTEMPTS) || 5,
		jwtSecret: process.env.JWT_SECRET,
		jwtAccessExpireTime: process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME || '10m'
	}
}

/**
 * Gets appropriate configuration for execution enviornment in any area of the app the includes this function.
 * @returns Appropriate configuration for the execution environment
 */
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
