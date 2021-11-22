import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import * as bcrypt from 'bcrypt'
import { testUsers } from './data/user.data'
import { AppModule } from './../src/app.module'
import { Sequelize, Dialect } from 'sequelize'
import { IConfigAttributes } from '../src/common/interfaces/config/app-config.interface'
import { getConfig } from '../src/config'
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as cookieParser from 'cookie-parser'
import { UserUpdatePasswdDto } from 'src/modules/auth/dto/user-update-passwd.dto'

// Config variables
const config: IConfigAttributes = getConfig()

describe('Authentication', () => {
	let app: INestApplication
	let connection: Sequelize

	// For use in testing protected endpoints
	let jwtToken: string
	let refreshToken: string

	// Setup test database
	beforeAll(async () => {
		const testModule: TestingModule = await Test.createTestingModule({
			imports: [ AppModule ]
		}).compile()

		// Get Database reference
		connection = new Sequelize({
			dialect: config.dbDialect as Dialect,
			host: config.dbHost,
			port: config.dbPort as number,
			database: config.dbDatabaseName,
			username: config.dbUsername,
			password: config.dbPassword,
			logging: false
		})

		// Remove any existing entries from the users table that might conflict with our tests
		await connection.query(`DELETE FROM ONLY users`, { logging: false })

		// Load some test data by using raw INSERT query (Test data from: test/data/*.data.ts)
		for (let i = 0; i < testUsers.length; i++) {
			const user = testUsers[i]
			const hashedPassword = await bcrypt.hash(user.password, config.bcryptSaltRounds as number)

			// Insert user into the database
			await connection.query(
				`INSERT INTO users (first_name, last_name, email, password, created_at,
				updated_at)\nVALUES('${user.firstName}','${user.lastName}',
				'${user.email}','${hashedPassword}','${new Date().toISOString()}',
				'${new Date().toISOString()}')\nRETURNING *;`,
				{ logging: false }
			)
		}

		// Create app context
		app = testModule.createNestApplication<NestExpressApplication>()

		// Allow parsing of cookies using cookie-parser
		app.use(cookieParser())

		// Insert global pipes here (see: https://stackoverflow.com/questions/58843038/how-to-manually-test-input-validation-with-nestjs-and-class-validator)
		app.useGlobalPipes(
			new ValidationPipe({
				forbidUnknownValues: true,
				whitelist: true,
				forbidNonWhitelisted: true
			})
		)

		// Start the server for testing
		await app.init()
	})

	describe('AuthController', () => {
		describe('Register Users', () => {
			const API_REGISTER_ENDPOINT = '/register'

			it('should register a user', async () => {
				const data = {
					firstName: 'Malik',
					lastName: 'Sheharyaar',
					email: 'sheharyaar@isthebest.com',
					password: 'sheharyaar'
				}
				const res = await request(app.getHttpServer()).post(API_REGISTER_ENDPOINT).send(data)

				const body = res.body
				expect(res.status).toBe(HttpStatus.CREATED)
				expect(body.firstName).toBe(data.firstName)
				expect(body.email).toBe(data.email)
			})
			it('should fail to register existing user', async () => {
				const data = testUsers[0]
				const res = await request(app.getHttpServer()).post(API_REGISTER_ENDPOINT).send(data)

				const body = res.body
				expect(res.status).toBe(HttpStatus.CONFLICT)
				expect(body.message).toMatch('exists')
			})

			it('should respond with bad request for missing required data', async () => {
				const data = {
					firstName: testUsers[0].firstName,
					lastName: testUsers[0].lastName,
					password: testUsers[0].password
				}
				const res = await request(app.getHttpServer()).post(API_REGISTER_ENDPOINT).send(data)

				const body = res.body
				expect(res.status).toBe(HttpStatus.BAD_REQUEST)
				expect(body.message[0]).toMatch('email')
			})
		})
		describe('User Login', () => {
			const API_LOGIN_ENDPOINT = '/login'

			it('should respond with "user does not exist" with invalid email', async () => {
				const data = {
					email: 'fake.email@fake.com',
					password: 'password'
				}
				const res = await request(app.getHttpServer()).post(API_LOGIN_ENDPOINT).send(data)

				const body = res.body
				expect(res.status).toBe(HttpStatus.UNAUTHORIZED)
				expect(body.access_token).not.toBeDefined()
				expect(body.message).toMatch('does not exist')
			})
			it('should deny access to user with incorrect password', async () => {
				const data = {
					email: testUsers[0].email,
					password: 'wrongpass'
				}
				const res = await request(app.getHttpServer()).post(API_LOGIN_ENDPOINT).send(data)

				const body = res.body
				expect(res.status).toBe(HttpStatus.UNAUTHORIZED)
				expect(body.access_token).not.toBeDefined()
				expect(body.message).toMatch('Incorrect email or password')
			})
			it('should provide JWT access & refresh tokens with valid login', async () => {
				const data = {
					email: testUsers[0].email,
					password: 'password'
				}
				const res = await request(app.getHttpServer()).post(API_LOGIN_ENDPOINT).send(data)

				const body = res.body
				expect(res.status).toBe(HttpStatus.CREATED)
				expect(body.accessToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
				expect(body.refreshToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)

				// Set access & refresh tokens for use in subsequent tests
				jwtToken = body.accessToken
				refreshToken = body.refreshToken
			})
		})

		describe('Protected Resources and Refreshing Tokens', () => {
			const API_TEST_ENDPOINT = '/test'
			const API_REFRESH_ENDPOINT = '/refresh'

			it('should prevent access with an invalid access token', async () => {
				const res = await request(app.getHttpServer()).get(API_TEST_ENDPOINT).set('Authorization', `Bearer FAKE_TOKEN`)

				const body = res.body
				expect(res.status).toBe(HttpStatus.UNAUTHORIZED)
				expect(body.message).toMatch('Unauthorized')
			})
			it('should allow access with valid access token', async () => {
				const res = await request(app.getHttpServer()).get(API_TEST_ENDPOINT).set('Authorization', `Bearer ${jwtToken}`)

				const body = res.body
				expect(res.status).toBe(HttpStatus.OK)
				expect(body.id).toBeDefined()
				expect(body.email).toBeDefined()
			})
			it('should provide new access & refresh tokens by using a valid refresh token', async () => {
				const res = await request(app.getHttpServer())
					.post(API_REFRESH_ENDPOINT)
					.set('Cookie', [
						`refreshToken=${refreshToken}; Path=/; Domain=localhost; HttpOnly; Expires=Tue, 08 Feb 2080 18:25:59 GMT;`
					])

				const body = res.body
				expect(res.status).toBe(HttpStatus.CREATED)
				expect(body.accessToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
				expect(body.refreshToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
			})
			it('should prevent refresh of tokens with invalid refresh token', async () => {
				const res = await request(app.getHttpServer())
					.post(API_REFRESH_ENDPOINT)
					.set('Cookie', [
						`refreshToken=FAKE_REFRESH_TOKEN; Path=/; Domain=localhost; HttpOnly; Expires=Tue, 08 Feb 2080 18:25:59 GMT;`
					])

				const body = res.body
				expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY)
				expect(body.message).toMatch('Malformed refresh token' || 'Revoked' || 'could not be found')
			})
		})
	})

	describe('User data mangagement and updates', () => {
		it('should result in BAD_REQUEST if the users tries to update their password to the same thing', async () => {
			const reqData: UserUpdatePasswdDto = {
				password: 'password',
				newPassword: 'password'
			}

			const res = await request(app.getHttpServer())
				.put('/password')
				.set('Authorization', `Bearer ${jwtToken}`)
				.send(reqData)

			expect(res.status).toBe(HttpStatus.BAD_REQUEST)
			expect(res.body).toBeDefined()
			expect(res.body.message).toMatch('Cannot change password to the same thing')
		})

		it('should validate the user is logged in and prevent password from being changed with proper authorization', async () => {
			const reqData: UserUpdatePasswdDto = {
				password: 'password',
				newPassword: 'password'
			}

			const res = await request(app.getHttpServer()).put('/password').send(reqData)

			expect(res.status).toBe(HttpStatus.UNAUTHORIZED)
			expect(res.body).toBeDefined()
			expect(res.body.message).toBeDefined()
			expect(res.body.message).toMatch('Unauthorized')
		})

		it('should prevent the entry of empty passwords', async () => {
			const reqData: UserUpdatePasswdDto = {
				password: 'password',
				newPassword: ''
			}

			const res = await request(app.getHttpServer())
				.put('/password')
				.set('Authorization', `Bearer ${jwtToken}`)
				.send(reqData)

			expect(res.status).toBe(HttpStatus.BAD_REQUEST)
			expect(res.body).toBeDefined()
			expect(res.body.message).toBeInstanceOf(Array)
			expect(res.body.message[0]).toMatch('Your password must be at least 6 characters long')
		})

		it('should prevent the entry of passwords that are too long (longer than 32 characters)', async () => {
			const reqData: UserUpdatePasswdDto = {
				password: 'password',
				newPassword: 'WAYTOLONGPASSWORDABSOLUTLYOVERKILL1234567$$$'
			}

			const res = await request(app.getHttpServer())
				.put('/password')
				.set('Authorization', `Bearer ${jwtToken}`)
				.send(reqData)

			expect(res.status).toBe(HttpStatus.BAD_REQUEST)
			expect(res.body).toBeDefined()
			expect(res.body.message).toBeInstanceOf(Array)
			expect(res.body.message[0]).toMatch('Your password is too long')
		})

		it('should result in an updated User object response if the password is changed successfully', async () => {
			const reqData: UserUpdatePasswdDto = {
				password: 'password',
				newPassword: 'password1'
			}

			const res = await request(app.getHttpServer())
				.put('/password')
				.set('Authorization', `Bearer ${jwtToken}`)
				.send(reqData)

			expect(res.status).toBe(HttpStatus.OK)
			expect(res.body).toBeDefined()
			expect(res.body).toBeInstanceOf(Object)
			expect(res.body.password).toBeUndefined()
			expect(res.body.email).toMatch(testUsers[0].email)
		})

		afterAll(async () => {
			// Change password back to default ('password')
			try {
				const hashedPassword = await bcrypt.hash('password', config.bcryptSaltRounds)
				await connection.query(`UPDATE users SET password = '${hashedPassword}'`)
			} catch (err) {
				console.error(`Failed to reset passwords to defaults. Reason: ${err}`)
			}
		})
	})

	afterAll(async () => {
		// Close server
		await app.close()

		// Close db connection
		await connection.close()
	})
})
