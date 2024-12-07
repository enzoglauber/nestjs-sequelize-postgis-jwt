import { User } from './entities/user.entity'

export const USER_REPOSITORY = 'UsersRepository'

export const userProviders = [{ provide: USER_REPOSITORY, useValue: User }]
