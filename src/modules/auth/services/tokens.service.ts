import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { JwtService, JwtSignOptions } from '@nestjs/jwt'
import { getConfig } from '../../../config'
import { TokenExpiredError } from 'jsonwebtoken'
import { IConfigAttributes } from '../../../common/interfaces/config/app-config.interface'
import { IRefreshTokenPayload } from '../../../common/interfaces/token/refresh-token.interface'
import { RefreshToken } from '../../refresh-tokens/models/refresh-token.model'
import { RefreshTokensRepository } from '../../refresh-tokens/refresh-tokens.repository'
import { User } from '../../users/models/user.model'
import { UsersRepository } from '../../users/users.repository'

// Get some jwt config information
const config: IConfigAttributes = getConfig()

/**
 * Implements refresh and access token generation and management services 
 */
@Injectable()
export class TokensService {
	constructor(
		private readonly refreshTokensRepository: RefreshTokensRepository,
		private readonly usersRepository: UsersRepository,
		private readonly jwtService: JwtService
	) {}

	/**
	 * Generates a signed JWT access token for the provided user
	 * @param user The user who this access token is for
	 * @returns An encoded/signed JWT access token which contains the user payload
	 */
	async generateAccessToken(user: User): Promise<string> {
		// Note: Using default Sign Options from module import
		const payload = {
			email: user.email,
			sub: user.id
		}

		return this.jwtService.sign(payload)
	}

	/**
	 * Generates a refresh token with a set expire time for the specified user
	 * @param user the user who this refresh token is for
	 * @param expiresIn Expiration time (in seconds) for the refresh token
	 * @returns A valid and signed refresh token which can be used to refresh access for the user specified
	 */
	async generateRefreshToken(user: User, expiresIn: number): Promise<string> {
		// Remove any existing refresh token whenever we generate a new one (to limit potential for token compromise)
		const existingToken = await this.getStoredRefreshTokenWithUser(user.id)
		if (existingToken) {
			await this.refreshTokensRepository.removeRefreshToken(existingToken)
		}

		// Create the new refresh token
		const token = await this.refreshTokensRepository.createRefreshToken(user, expiresIn)

		// Override default Sign Options with Refresh token specific options
		const opts: JwtSignOptions = {
			secret: config.jwtSecret,
			subject: String(user.id),
			jwtid: String(token.id),
			expiresIn
		}

		return this.jwtService.sign({}, opts)
	}

	/**
	 * Decodes and verifies a refresh token and provides the payload information in clear-text for user data processing or access refresh
	 * @param token A valid refresh token
	 * @returns The JWT payload contained in the provided refresh token
	 */
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

	/**
	 * Extracts a refresh token payload into a valid refresh token object containing data about the token (expire time, revoked status, etc..)
	 * @param payload JWT payload
	 * @returns The extracted refresh token ID from the payload
	 */
	async getStoredTokenFromRefreshTokenPayload(payload: IRefreshTokenPayload): Promise<RefreshToken | undefined> {
		const tokenId = payload.jti

		if (!tokenId) {
			throw new UnprocessableEntityException({
				message: 'Refresh token is malformed'
			})
		}

		return this.refreshTokensRepository.findTokenById(tokenId)
	}

	/**
	 * Resolves the user and token from the encoded string containing the encoded refresh token payload
	 * @param encoded The encoded refresh token
	 * @returns A valid user association and refresh token object(s)
	 */
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

	/**
	 * Gets a stored refresh token from the auth database that belongs to the specified user
	 * @param id Unique ID of user
	 * @returns Refresh token that belongs to the specified user
	 */
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

	/**
	 * Generates a new access token from a provided encoded refresh token
	 * @param encodedToken The encoded refresh token
	 * @returns A new pair of access and refresh tokens with user data
	 */
	async createAccessTokenFromRefreshToken(
		encodedToken: string
	): Promise<{ accessToken: string; user: User; refreshToken: string }> {
		const { user } = await this.resolveRefreshToken(encodedToken)
		const accessToken = await this.generateAccessToken(user)
		const refreshToken = await this.generateRefreshToken(user, 7 * 24 * 60 * 60 * 1000)

		return { user, accessToken, refreshToken }
	}
}
