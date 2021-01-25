import { Model } from 'sequelize'
import { AllowNull, AutoIncrement, Column, DataType, PrimaryKey, Table } from 'sequelize-typescript'

@Table({ tableName: 'refresh_tokens', underscored: true })
export class RefreshToken extends Model<RefreshToken> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	_id: number

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
