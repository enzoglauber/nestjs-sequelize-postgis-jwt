import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import { AddressModule } from './address/address.module'
import { AuthModule } from './auth/auth.module'
import { CoreModule } from './core/core.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    CoreModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        JWT_TOKEN: Joi.string().required(),
        JWT_REFRESH: Joi.string().required(),
        JWT_TOKEN_TTL: Joi.string().required(),
        JWT_REFRESH_TTL: Joi.string().required(),
        NODE_ENV: Joi.string().required(),
        PORT: Joi.string().required()
      })
    }),
    AuthModule,
    AddressModule,
    UserModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
