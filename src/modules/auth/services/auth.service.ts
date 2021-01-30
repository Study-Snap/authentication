import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { User } from '../../users/models/user.model'
import { UsersRepository } from '../../users/users.repository'
import * as bcrypt from 'bcrypt'
import { IConfigAttributes } from 'src/interfaces/config/app-config.interface'
import { getConfig } from 'src/config'
import { TokensService } from './tokens.service'

const config: IConfigAttributes = getConfig()

@Injectable()
export class AuthService {
	constructor(private readonly usersRepository: UsersRepository, private readonly tokensService: TokensService) {}

	async register({ firstName, lastName, email, password }): Promise<User> {
		const user = await this.usersRepository.findUserByEmail(email)

		if (user)
			throw new UnauthorizedException({
				message: 'A user with that email already exists'
			})

		const hashedPassword = await bcrypt.hash(password, config.bcryptSaltRounds)
		password = hashedPassword
		return this.usersRepository.createUser({
			firstName,
			lastName,
			email,
			password
		})
	}

	async validate(email: string, password: string): Promise<User | undefined> {
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

	async getAccessAndRefreshTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
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
