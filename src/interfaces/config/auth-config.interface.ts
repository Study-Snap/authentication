export interface IConfigAttributes {
	listenPort: number | string
	maxRequests: number
	bcryptSaltRounds: number | string
	dbDialect: string
	dbHost: string
	dbPort: number | string
	dbUserDatabase: string
	dbUsername: string
	dbPassword: string
	dbRetryAttempts: number | string
	jwtSecret: string
	jwtAccessExpireTime: string
	jwtRefreshExpireTime: string
}

export interface IConfig {
	development: IConfigAttributes
	test: IConfigAttributes
	production: IConfigAttributes
}
