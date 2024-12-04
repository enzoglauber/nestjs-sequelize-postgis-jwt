import { Sequelize } from 'sequelize-typescript'
import { Address } from 'src/address/entities/address.entity'
import { User } from 'src/user/entities/user.entity'
import { DEVELOPMENT, PRODUCTION, SEQUELIZE, TEST } from '../constants'

export const providers = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = config.development
          break
        case TEST:
          config = config.test
          break
        case PRODUCTION:
          config = config.production
          break
        default:
          config = config.development
      }
      const sequelize = new Sequelize({
        ...config,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false // <<<<<<< YOU NEED THIS
          }
        }
      })
      sequelize.addModels([User, Address])
      await sequelize.sync()
      return sequelize
    }
  }
]
