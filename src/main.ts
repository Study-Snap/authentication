import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'
import { getConfig } from './config'
import { IConfigAttributes } from './common/interfaces/config/app-config.interface'
import { limitRequests } from './middleware/ratelimit.middleware'
import * as cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { PROJECT_VERSION } from './common/constants'

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

	// Swagger-UI Doc setup
	const swaggerConfig = new DocumentBuilder()
		.setTitle('StudySnap Authentication')
		.setDescription('Documentation for the StudySnap Authentication server API')
		.setVersion(PROJECT_VERSION)
		.addTag('auth')
		.build()
	const document = SwaggerModule.createDocument(app, swaggerConfig)
	SwaggerModule.setup('docs', app, document, {
		swaggerOptions: {
			supportedSubmitMethods: []
		}
	})

	await app.listen(config.listenPort)
}
bootstrap()
