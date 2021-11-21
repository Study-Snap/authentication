import {
	BadRequestException,
	ConflictException,
	HttpStatus,
	Injectable,
	InternalServerErrorException,
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
import { PasswdChangeSuccessResp } from '../types/passwd-changed-success-response.type'

const config: IConfigAttributes = getConfig()

@Injectable()
export class AuthService {
	constructor(private readonly usersRepository: UsersRepository, private readonly tokensService: TokensService) {}

	async register({ firstName, lastName, email, password }): Promise<User> {
		const user = await this.usersRepository.findUserByEmail(email)

		// Verify user does not already exist
		if (user) throw new ConflictException({ message: 'A user with that email already exists' })

		// Hash password for storage
		const hashedPassword = await bcrypt.hash(password, config.bcryptSaltRounds)
		password = hashedPassword
		return this.usersRepository.createUser({
			firstName,
			lastName,
			email,
			password
		})
	}

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

		return this.usersRepository.findUserByEmail(user.email)
	}

	async updatePassword(
		userId: number,
		currentPassword: string,
		newPassword: string
	): Promise<PasswdChangeSuccessResp | undefined> {
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
		const hashedPassword = await bcrypt.hash(newPassword, config.bcryptSaltRounds)
		await this.usersRepository.updatePassword(user, hashedPassword)

		return {
			statusCode: HttpStatus.OK,
			message: `Successfully changed password for ${user.firstName}`
		}
	}

	async updateEmail(email: string, password: string, newEmail: string): Promise<User> {
		const user = await this.validate(email, password)

		if (!user) {
			throw new NotFoundException(`Could not validate the user with email, ${email}`)
		}

		await this.usersRepository.updateEmail(user, newEmail)
		return this.usersRepository.findUserByEmail(email)
	}

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
