import { Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { getConfig } from 'src/config'
import { IConfigAttributes } from 'src/interfaces/config/app-config.interface'
import { User } from '../users/models/user.model'
import { RefreshToken } from './models/refresh-token.model'

const config: IConfigAttributes = getConfig()

@Injectable()
export class RefreshTokensRepository {
	constructor(@InjectModel(RefreshToken) private refreshTokenModel: typeof RefreshToken) {}

	async createRefreshToken(user: User, ttl: number): Promise<RefreshToken | undefined> {
		// Get expiration date
		const expiration = new Date()
		expiration.setTime(expiration.getTime() + ttl)

		// Create refresh token in database
		const token = await this.refreshTokenModel.create({
			userId: user._id,
			isRevoked: false,
			expires: expiration
		})

		return token
	}

	async findTokenById(id: number): Promise<RefreshToken | undefined> {
		return this.refreshTokenModel.findOne({
			where: {
				id
			}
		})
	}

	async findTokenByUserId(id: number): Promise<RefreshToken | undefined> {
		return this.refreshTokenModel.findOne({
			where: {
				userId: id
			}
		})
	}

	async invalidateRefreshToken(token: RefreshToken): Promise<RefreshToken | undefined> {
		return token.update({
			isRevoked: true
		})
	}

	async removeRefreshToken(token: RefreshToken): Promise<void> {
		try {
			await token.destroy()
		} catch (err) {
			throw new InternalServerErrorException({ message: 'Refresh token malformed or does not exist anymore' })
		}
	}
}
