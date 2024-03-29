import {
	BadRequestException,
	ConflictException,
	Injectable,
	Logger,
	NotFoundException,
	UnauthorizedException,
	UnprocessableEntityException
} from '@nestjs/common'
import { User } from '../../users/models/user.model'
import { UsersRepository } from '../../users/users.repository'
import * as bcrypt from 'bcrypt'
import { IConfigAttributes } from '../../../common/interfaces/config/app-config.interface'
import { getConfig } from '../../../config'
import { TokensService } from './tokens.service'
import { AccessPairs } from '../types/access-pairs.type'

const config: IConfigAttributes = getConfig()

/**
 * Class for all authentication service functions to be injected into modules or app
 */
@Injectable()
export class AuthService {
	constructor(private readonly usersRepository: UsersRepository, private readonly tokensService: TokensService) {}

	/**
	 * Creates/registers a user in the application database
	 * @param data Contains firstName, lastName, email and password to register the user
	 * @returns The created user object
	 */
	async register({ firstName, lastName, email, password }): Promise<User> {
		const user = await this.usersRepository.findUserByEmail(email)

		// Verify user does not already exist
		if (user) throw new ConflictException({ message: 'A user with that email already exists' })

		// Hash password for storage
		Logger.log(`Creating account with email: ${email}`)
		const hashedPassword = await bcrypt.hash(password, config.bcryptSaltRounds)
		password = hashedPassword
		return this.usersRepository.createUser({
			firstName,
			lastName,
			email,
			password
		})
	}

	/**
	 * Validates the user's email:password combination is correct and then provides their user data in the response
	 * @param email Users email
	 * @param password Users password
	 * @returns The user details that match the provided credentials
	 */
	async validate(email: string, password: string): Promise<User> {
		const user = await this.usersRepository.findUserByEmailForAuth(email)

		if (!user) {
			throw new UnauthorizedException({ message: 'User does not exist' })
		}

		const response = await bcrypt.compare(password, user.password)
		if (!response) {
			throw new UnauthorizedException({
				message: 'Incorrect email or password'
			})
		}

		Logger.log(`User logged successfully: ${email}`)
		return this.usersRepository.findUserByEmail(user.email)
	}

	/**
	 * Updates a users password
	 * @param userId The unique id for the user
	 * @param currentPassword The users current password to validate
	 * @param newPassword The users new password selection
	 * @returns The updated user object (`NO PASSWORD FIELD SUPPLIED`)
	 */
	async updatePassword(userId: number, currentPassword: string, newPassword: string): Promise<User | undefined> {
		const user = await this.usersRepository.findUserById(userId)

		// Ensure user exists
		if (!user) {
			throw new NotFoundException(`Could not validate the user with ID, ${userId}`)
		}

		// Validate the users credentials (current password) before moving forward with the change
		await this.validate(user.email, currentPassword)

		// Ensure the passwords are not the same
		if (currentPassword === newPassword) {
			throw new BadRequestException(`Cannot change password to the same thing`)
		}

		// Hash and update password
		Logger.log(`Updating password for user: ${user.email}`)
		const hashedPassword = await bcrypt.hash(newPassword, config.bcryptSaltRounds)
		return this.usersRepository.updatePassword(user, hashedPassword)
	}

	/**
	 * Updates a users email address associated with their account
	 * @param email Users email address
	 * @param password Users password
	 * @param newEmail Users new email to set
	 * @returns Updated user object containing the new email
	 */
	async updateEmail(email: string, password: string, newEmail: string): Promise<User | undefined> {
		const user = await this.validate(email, password)

		if (!user) {
			throw new NotFoundException(`Could not validate the user with email, ${email}`)
		}

		Logger.log(`Updating email for user: ${user.email}`)
		await this.usersRepository.updateEmail(user, newEmail)
		return this.usersRepository.findUserByEmail(email)
	}

	/**
	 * Generates a unique JWT access token and refresh token pair for a specified user
	 * @param user Unique user object for the user
	 * @returns Valid pair of JWT access and refresh tokens which will allow stateless authentication with the app
	 */
	async getAccessAndRefreshTokens(user: User): Promise<AccessPairs> {
		if (!user) {
			throw new UnprocessableEntityException({
				message: 'User object is malformed'
			})
		}

		// Generate new access token and refresh token
		const accessToken = await this.tokensService.generateAccessToken(user)
		const refreshToken = await this.tokensService.generateRefreshToken(user, 7 * 24 * 60 * 60 * 1000)

		return { accessToken, refreshToken }
	}
}
