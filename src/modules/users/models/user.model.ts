import { ApiProperty } from '@nestjs/swagger'
import { Model } from 'sequelize'
import { AllowNull, AutoIncrement, Column, DataType, IsEmail, PrimaryKey, Table, Unique } from 'sequelize-typescript'

/**
 * a User model definition containing all the attributes of a user
 */
@Table({ tableName: 'users', underscored: true })
export class User extends Model<User> {
	@ApiProperty()
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	id: number

	@ApiProperty()
	@Unique
	@IsEmail
	@AllowNull(false)
	@Column(DataType.STRING)
	email: string

	@ApiProperty()
	@AllowNull(false)
	@Column(DataType.STRING)
	password: string

	@ApiProperty()
	@AllowNull(false)
	@Column(DataType.STRING)
	firstName: string

	@ApiProperty()
	@AllowNull(false)
	@Column(DataType.STRING)
	lastName: string

	/**
	 * Note: updated_at, created_at fields are automatically generated
	 */
}
