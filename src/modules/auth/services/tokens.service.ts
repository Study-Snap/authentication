import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { JwtService, JwtSignOptions } from '@nestjs/jwt'
import { getConfig } from '../../../config'
import { TokenExpiredError } from 'jsonwebtoken'
import { IConfigAttributes } from '../../../interfaces/config/app-config.interface'
import { IRefreshTokenPayload } from '../../../interfaces/token/refresh-token.interface'
import { RefreshToken } from '../../refresh-tokens/models/refresh-token.model'
import { RefreshTokensRepository } from '../../refresh-tokens/refresh-tokens.repository'
import { User } from '../../users/models/user.model'
import { UsersRepository } from '../../users/users.repository'

// Get some jwt config information
const config: IConfigAttributes = getConfig()

@Injectable()
export class TokensService {
	constructor(
		private readonly refreshTokensRepository: RefreshTokensRepository,
		private readonly usersRepository: UsersRepository,
		private readonly jwtService: JwtService
	) {}

	async generateAccessToken(user: User): Promise<string> {
		// Note: Using default Sign Options from module import
		const payload = {
			email: user.email,
			sub: user._id
		}

		return this.jwtService.sign(payload)
	}

	async generateRefreshToken(user: User, expiresIn: number): Promise<string> {
		// Remove any existing refresh token whenever we generate a new one (to limit potential for token compromise)
		const existingToken = await this.getStoredRefreshTokenWithUser(user._id)
		if (existingToken) {
			await existingToken.destroy()
		}

		// Create the new refresh token
		const token = await this.refreshTokensRepository.createRefreshToken(user, expiresIn)

		// Override default Sign Options with Refresh token specific options
		const opts: JwtSignOptions = {
			secret: config.jwtSecret,
			subject: String(user._id),
			jwtid: String(token._id),
			expiresIn
		}

		return this.jwtService.sign({}, opts)
	}

	async decodeRefreshToken(token: string): Promise<IRefreshTokenPayload> {
		try {
			return this.jwtService.verify(token)
		} catch (err) {
			if (err instanceof TokenExpiredError) {
				throw new UnprocessableEntityException({
					message: 'Refresh token is expired'
				})
			}
			throw new UnprocessableEntityException({
				message: 'Malformed refresh token'
			})
		}
	}

	async getStoredTokenFromRefreshTokenPayload(payload: IRefreshTokenPayload): Promise<RefreshToken | undefined> {
		const tokenId = payload.jti

		if (!tokenId) {
			throw new UnprocessableEntityException({
				message: 'Refresh token is malformed'
			})
		}

		return this.refreshTokensRepository.findTokenById(tokenId)
	}

	async resolveRefreshToken(encoded: string): Promise<{ user: User; token: RefreshToken }> {
		const payload = await this.decodeRefreshToken(encoded)
		const token = await this.getStoredTokenFromRefreshTokenPayload(payload)

		if (!token) {
			throw new UnprocessableEntityException({
				message: 'Refresh token could not be found'
			})
		}

		if (token.isRevoked) {
			throw new UnprocessableEntityException({
				message: 'Refresh token revoked'
			})
		}

		const user = await this.usersRepository.findUserById(payload.sub)

		if (!user) {
			throw new UnprocessableEntityException({
				message: 'Could not find a user associated with this refresh token'
			})
		}

		return {
			user,
			token
		}
	}

	async getStoredRefreshTokenWithUser(id: number): Promise<RefreshToken | undefined> {
		return this.refreshTokensRepository.findTokenByUserId(id)
	}

	async invalidateRefreshToken(encoded: string): Promise<RefreshToken> {
		const { token } = await this.resolveRefreshToken(encoded)

		if (!token) {
			throw new UnprocessableEntityException({
				message: 'Refresh token could not be found'
			})
		}

		const res = await this.refreshTokensRepository.invalidateRefreshToken(token)

		if (!res) {
			throw new UnprocessableEntityException({
				message: 'Something went wrong when trying to invalidate the refresh token'
			})
		}

		return res
	}

	async createAccessTokenFromRefreshToken(
		encodedToken: string
	): Promise<{ accessToken: string; user: User; refreshToken: string }> {
		const { user } = await this.resolveRefreshToken(encodedToken)
		const accessToken = await this.generateAccessToken(user)
		const refreshToken = await this.generateRefreshToken(user, 7 * 24 * 60 * 60 * 1000)

		return { user, accessToken, refreshToken }
	}
}
