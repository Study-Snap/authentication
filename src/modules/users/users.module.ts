import { UsersRepository } from './users.repository'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from './models/user.model'

@Module({
	imports: [
		SequelizeModule.forFeature([
			User
		])
	],
	controllers: [],
	providers: [
		UsersRepository
	],
	exports: [
		SequelizeModule
	]
})
export class UsersModule {}
