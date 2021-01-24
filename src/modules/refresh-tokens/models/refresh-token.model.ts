import { Model } from 'sequelize'
import { AutoIncrement, Column, DataType, NotNull, PrimaryKey, Table } from 'sequelize-typescript'

@Table({ tableName: 'refresh_tokens', underscored: true })
export class RefreshToken extends Model<RefreshToken> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	_id: number

	@NotNull
	@Column(DataType.INTEGER)
	userId: number

	@NotNull
	@Column(DataType.BOOLEAN)
	isRevoked: boolean

	@NotNull
	@Column(DataType.DATE)
	expires: Date
}
