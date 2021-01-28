import { Test, TestingModule } from '@nestjs/testing'
import { User } from './models/user.model'
import { UsersRepository } from './users.repository'
import { getModelToken } from '@nestjs/sequelize'
import { Model } from 'sequelize/types'
import { MockType } from '../../../test/types'
import { userModelMockFactory } from '../../../test/mock'
import { UserCreateDto } from '../auth/dto/user-create.dto'

describe('UsersRepository', () => {
	let repository: UsersRepository
	let mockModel: MockType<Model<User>>

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [
				UsersRepository,
				{
					provide: getModelToken(User),
					useValue: mockModel,
					useFactory: userModelMockFactory
				}
			]
		}).compile()

		repository = moduleRef.get<UsersRepository>(UsersRepository)
	})

	describe('createUser', () => {
		it('should create user with name Tom', async () => {
			const userDto: UserCreateDto = {
				firstName: 'Tom',
				lastName: 'Jerry',
				email: 'test@example.com',
				password: 'password'
			}

			const user = await repository.createUser({ ...userDto })

			expect(user).toBeDefined()
			expect(user.password).toBeUndefined()
			expect(user.firstName).toEqual(userDto.firstName)
			expect(user.lastName).toEqual(userDto.lastName)
			expect(user.email).toEqual(userDto.email)
		})
	})

	describe('findUserByEmail', () => {
		it('should find user and return a user object', async () => {
			const expected = {
				firstName: 'Tom',
				email: 'test@example.com'
			}

			const user = await repository.findUserByEmail(expected.email)

			expect(user).toBeDefined()
			expect(user.firstName).toEqual(expected.firstName)
			expect(user.email).toEqual(expected.email)
			expect(user.password).toBeUndefined()
		})
	})

	describe('findUserByEmailForAuth', () => {
		it('should find user and return user object WITH PASSWORD', async () => {
			const expected = {
				firstName: 'Tom',
				email: 'test@example.com',
				password: 'password'
			}

			const user = await repository.findUserByEmailForAuth(expected.email)

			expect(user).toBeDefined()
			expect(user.firstName).toEqual(expected.firstName)
			expect(user.email).toEqual(expected.email)
			expect(user.password).toBeDefined()
			expect(user.password).toEqual(expected.password)
		})
	})

	describe('findUserById', () => {
		it('should find a user and return a user object', async () => {
			const id: number = 1
			const expected = {
				firstName: 'Tom',
				password: 'password'
			}

			const user = await repository.findUserById(id)

			expect(user).toBeDefined()
			expect(user.firstName).toEqual(expected.firstName)
			expect(user.password).toBeDefined()
			expect(user.password).toEqual(expected.password)
		})
	})
})
