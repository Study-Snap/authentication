import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { User } from '../users/models/user.model'
import { RefreshToken } from './models/refresh-token.model'

/**
 * Interface between the authentication module and refresh tokens data store (database)
 */
@Injectable()
export class RefreshTokensRepository {
	constructor(@InjectModel(RefreshToken) private refreshTokenModel: typeof RefreshToken) {}

	/**
	 * Creates and stores a reference to a refresh token in the database
	 * @param user The user id or user object to create the refresh token for
	 * @param ttl The time to expire for the generated refreshtoken
	 * @returns A refresh token object (if created successfully)
	 */
	async createRefreshToken(user: User | { id: number }, ttl: number): Promise<RefreshToken | undefined> {
		// Get expiration date
		const expiration = new Date()
		expiration.setTime(expiration.getTime() + ttl)

		// Create refresh token in database
		const token = await this.refreshTokenModel.create({
			userId: user.id,
			isRevoked: false,
			expires: expiration
		})

		return token
	}

	/**
	 * Finds and returns details about a specified refresh token given an ID
	 * @param id Refresh token unique ID
	 * @returns A refresh token object
	 */
	async findTokenById(id: number): Promise<RefreshToken | undefined> {
		return this.refreshTokenModel.findOne({
			where: {
				id
			}
		})
	}

	/**
	 * Gets and returns details about a refresh token owned by a specified user
	 * @param id Unique ID for a user
	 * @returns A refresh token object
	 */
	async findTokenByUserId(id: number): Promise<RefreshToken | undefined> {
		return this.refreshTokenModel.findOne({
			where: {
				userId: id
			}
		})
	}

	/**
	 * Invalidates a refresh token by updating its `isRevoked` attribute so that a user can no longer use it to authenticate themselves
	 * @param token The refresh token object based on the database model
	 * @returns An updated refresh token object
	 */
	async invalidateRefreshToken(token: RefreshToken): Promise<RefreshToken | undefined> {
		return token.update({
			isRevoked: true
		})
	}

	/**
	 * Removes a refresh token from the database
	 * @param token The refresh token to remove(drop) from the database
	 */
	async removeRefreshToken(token: RefreshToken): Promise<void> {
		try {
			await token.destroy()
		} catch (err) {
			throw new UnprocessableEntityException({
				message: 'Refresh token malformed or does not exist anymore'
			})
		}
	}
}
