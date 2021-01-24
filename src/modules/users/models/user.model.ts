import { Model } from 'sequelize'
import { AutoIncrement, Column, DataType, IsEmail, NotNull, PrimaryKey, Table, Unique } from 'sequelize-typescript'

@Table({ tableName: 'users', underscored: true })
export class User extends Model<User> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	_id: number

	@Unique
	@IsEmail
	@NotNull
	@Column(DataType.STRING)
	email: string

	@NotNull
	@Column(DataType.STRING)
	password: string

	@NotNull
	@Column(DataType.STRING)
	firstName: string

	@NotNull
	@Column(DataType.STRING)
	lastName: string

	/**
   * Note: updated_at, created_at fields are automatically generated
   */
}
