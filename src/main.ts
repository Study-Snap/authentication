import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'
import { getConfig } from './config'
import { IConfigAttributes } from './interfaces/config/app-config.interface'
import { limitRequests } from './middleware/ratelimit.middleware'
import * as cookieParser from 'cookie-parser'

const config: IConfigAttributes = getConfig()

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule)

	// Configure the app
	app.enableCors()
	app.use(limitRequests(config.maxRequests))
	app.use(cookieParser())

	// Validate DTOs sent with request
	app.useGlobalPipes(
		new ValidationPipe({
			forbidUnknownValues: true,
			whitelist: true,
			forbidNonWhitelisted: true
		})
	)

	await app.listen(config.listenPort)
}
bootstrap()
