import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { PASSWORD_FIELD } from '../../common/constants/index'
import { User } from './models/user.model'

@Injectable()
export class UsersRepository {
	constructor(@InjectModel(User) private userModel: typeof User) {}

	async findUserByEmail(email: string): Promise<User | undefined> {
		return this.userModel.findOne({
			where: {
				email
			},
			attributes: {
				exclude: [ PASSWORD_FIELD ]
			}
		})
	}

	async findUserByEmailForAuth(email: string): Promise<User | undefined> {
		return this.userModel.findOne({
			where: {
				email
			}
		})
	}

	async findUserById(id: number): Promise<User | undefined> {
		return this.userModel.findOne({
			where: {
				id
			}
		})
	}

	async createUser({ firstName, lastName, email, password }): Promise<User | undefined> {
		const response = await this.userModel
			.create({
				firstName,
				lastName,
				email,
				password
			})
			.catch(() => {
				throw new BadRequestException({ message: `Problem registering this user in the database...` })
			})

		if (!response) {
			throw new InternalServerErrorException({
				message: `An unknown error occurred when trying to register...`
			})
		}

		return this.findUserByEmail(email)
	}

	async updateEmail(user: User, newEmail: string): Promise<User | undefined> {
		return user.update({
			email: newEmail
		})
	}

	async updatePassword(user: User, newPasswordHash: string): Promise<User | undefined> {
		const userd = await user.update({
			password: newPasswordHash
		})

		return this.userModel.findOne({ where: { id: userd.id }, attributes: { exclude: [ PASSWORD_FIELD ] } })
	}
}
