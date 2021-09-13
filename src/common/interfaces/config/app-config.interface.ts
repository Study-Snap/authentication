export interface IConfigAttributes {
	listenPort: number | string
	maxRequests: number
	bcryptSaltRounds: number | string
	dbDialect: string
	dbHost: string
	dbPort: number | string
	dbDatabaseName: string
	dbUsername: string
	dbPassword: string
	dbRetryAttempts: number | string
	jwtSecret: string
	jwtAccessExpireTime: string
}

export interface IConfig {
	development: IConfigAttributes
	test: IConfigAttributes
	production: IConfigAttributes
}
