import { Sequelize } from 'sequelize-typescript'
import { Address } from 'src/address/entities/address.entity'
import { User } from 'src/user/entities/user.entity'
import { DEVELOPMENT, PRODUCTION, SEQUELIZE, TEST } from '../constants'
import { config } from './database.config'

export const providers = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let options
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          options = config.development
          break
        case TEST:
          options = config.test
          break
        case PRODUCTION:
          options = config.production
          break
        default:
          options = config.development
      }
      const sequelize = new Sequelize({
        ...options
        // dialectOptions: {
        //   ssl: {
        //     require: true,
        //     rejectUnauthorized: false // <<<<<<< YOU NEED THIS
        //   }
        // }
      })
      sequelize.addModels([User, Address])
      await sequelize.sync()
      return sequelize
    }
  }
]
