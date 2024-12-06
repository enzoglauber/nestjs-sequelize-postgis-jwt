import { User } from './entities/user.entity'

export const USER_REPOSITORY = 'UsersRepository'

export const usersProviders = [{ provide: USER_REPOSITORY, useValue: User }]
