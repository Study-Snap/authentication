import { Test } from '@nestjs/testing'
import { User } from './models/user.model'
import { UsersRepository } from './users.repository'

describe('UsersRepository', () => {
	let usersRespository = { createUser: () => 'Tom' }

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				UsersRepository
			]
		})
			.overrideProvider(UsersRepository)
			.useValue(usersRespository)
			.compile()
	})

	describe('createUser', () => {
		it('should be tom', async () => {
			const result = 'Tom'
			expect(await usersRespository.createUser()).toBe(result)
		})
	})
})
