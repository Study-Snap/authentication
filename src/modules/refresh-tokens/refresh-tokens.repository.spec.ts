import { getModelToken } from '@nestjs/sequelize'
import { Test, TestingModule } from '@nestjs/testing'
import { Model } from 'sequelize/types'
import { refreshTokenModelMockFactory } from '../../../test/mock'
import { MockType } from '../../../test/types'
import { RefreshToken } from './models/refresh-token.model'
import { RefreshTokensRepository } from './refresh-tokens.repository'

describe('RefreshTokensRepository', () => {
	let repository: RefreshTokensRepository
	let mockModel: MockType<Model<RefreshToken>>

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [
				RefreshTokensRepository,
				{
					provide: getModelToken(RefreshToken),
					useValue: mockModel,
					useFactory: refreshTokenModelMockFactory
				}
			]
		}).compile()

		repository = moduleRef.get<RefreshTokensRepository>(RefreshTokensRepository)
	})

	describe('createRefreshToken', () => {
		it('should create a refresh token in the database and return the created token model', async () => {
			const expected = {
				userId: 123
			}

			const token = await repository.createRefreshToken({ _id: expected.userId }, 1000)

			expect(token).toBeDefined()
			expect(token.userId).toEqual(expected.userId)
			expect(token.isRevoked).toBeFalsy()
			expect(token.expires).toBeDefined()
		})
	})
})
