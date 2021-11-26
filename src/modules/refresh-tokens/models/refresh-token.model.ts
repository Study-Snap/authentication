import { Model } from 'sequelize'
import { AllowNull, AutoIncrement, Column, DataType, PrimaryKey, Table } from 'sequelize-typescript'

/**
 * The model that describes attributes of the refresh token inside of the postgresql/other database
 */
@Table({ tableName: 'refresh_tokens', underscored: true })
export class RefreshToken extends Model<RefreshToken> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	id: number

	@AllowNull(false)
	@Column(DataType.INTEGER)
	userId: number

	@AllowNull(false)
	@Column(DataType.BOOLEAN)
	isRevoked: boolean

	@AllowNull(false)
	@Column(DataType.DATE)
	expires: Date
}
