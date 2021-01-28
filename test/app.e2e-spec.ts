import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { testUsers } from './data/user.data'
import { AppModule } from './../src/app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { Sequelize } from 'sequelize'

let app: NestExpressApplication
let connection: Sequelize

// Setup test database
beforeAll(async () => {
	const moduleRef: TestingModule = await Test.createTestingModule({
		imports: [
			AppModule
		]
	}).compile()

	app = moduleRef.createNestApplication<NestExpressApplication>()
	await app.init()

	// Get Database connection

	// Drop any existing test database

	// Create (if not exists) a test database

	// Load some test data by using raw INSERT query

	// Close connection
})

// TODO: Remove this placeholder test
describe('AUTH', () => {
	it('should be 1 + 1', () => {
		expect(1 + 1).toEqual(2)
	})
})
