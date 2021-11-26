import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { PASSWORD_FIELD } from '../../common/constants/index'
import { User } from './models/user.model'

/**
 * User data interface between auth service functions and the user in the database
 */
@Injectable()
export class UsersRepository {
	constructor(@InjectModel(User) private userModel: typeof User) {}

	/**
	 * Finds and retrieves data about a user provided their email address
	 * @param email an email address
	 * @returns A user that has that email address
	 */
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

	/**
	 * A special function for getting user data given an email address specifically for 
	 * authentication purposes as it does not filder out the password hash from its result
	 * @param email a users email address
	 * @returns A user data object
	 */
	async findUserByEmailForAuth(email: string): Promise<User | undefined> {
		return this.userModel.findOne({
			where: {
				email
			}
		})
	}

	/**
	 * Returns a user data object for the specified user	
	 * @param id Unique ID for a user
	 * @returns A user data object
	 */
	async findUserById(id: number): Promise<User | undefined> {
		return this.userModel.findOne({
			where: {
				id
			}
		})
	}

	/**
	 * Creates a new user (registers)
	 * @param data A arbitrary data object containing all the necessary fields for creating the user
	 * @returns The created user
	 */
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

	/**
	 * Updates a users email address associated with their account
	 * @param user the user to update
	 * @param newEmail the new email to set for the user
	 * @returns The new updated user object with the new email
	 */
	async updateEmail(user: User, newEmail: string): Promise<User | undefined> {
		return user.update({
			email: newEmail
		})
	}

	/**
	 * Updates the users password associated with their account
	 * @param user the user to update
	 * @param newPasswordHash The new password (hashed + salted) for the user
	 * @returns The updated user object (Password field is excluded from response for security reasons)
	 */
	async updatePassword(user: User, newPasswordHash: string): Promise<User | undefined> {
		const userd = await user.update({
			password: newPasswordHash
		})

		return this.userModel.findOne({ where: { id: userd.id }, attributes: { exclude: [ PASSWORD_FIELD ] } })
	}
}
