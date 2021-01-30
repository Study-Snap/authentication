import { Model } from 'sequelize/types'
import { MockType } from '../types'

// @ts-ignore
export const userModelMockFactory: () => MockType<Model<any>> = jest.fn(() => ({
	findOne: jest.fn((params) => {
		if (params.attributes)
			return {
				firstName: 'Tom',
				lastName: 'Jerry',
				email: 'test@example.com'
			}
		else
			return {
				firstName: 'Tom',
				lastName: 'Jerry',
				email: 'test@example.com',
				password: 'password'
			}
	}),
	create: async () => jest.fn(() => '')
}))

// @ts-ignore
export const refreshTokenModelMockFactory: () => MockType<Model<any>> = jest.fn(() => ({
	create: jest.fn(({ userId, expires }) => ({
		userId: userId,
		isRevoked: false,
		expires: expires
	})),
	findOne: jest.fn((params) => ({
		...params.where
	})),
	update: jest.fn((params) => ({
		...params
	}))
}))
