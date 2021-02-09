import { UserCreateDto } from 'src/modules/auth/dto/user-create.dto'

export const testUsers: UserCreateDto[] = [
	{
		firstName: 'Tom',
		lastName: 'Jerry',
		email: 'tom@jerry.com',
		password: 'password'
	},
	{
		firstName: 'Bill',
		lastName: 'Berry',
		email: 'bill@berry.com',
		password: 'password'
	},
	{
		firstName: 'Bob',
		lastName: 'Job',
		email: 'test@example.com',
		password: 'password'
	}
]
