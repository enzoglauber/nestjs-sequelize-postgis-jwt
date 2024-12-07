import { Address } from './entities/address.entity'

export const ADDRESS_REPOSITORY = 'UsersRepository'

export const addressProviders = [{ provide: ADDRESS_REPOSITORY, useValue: Address }]
