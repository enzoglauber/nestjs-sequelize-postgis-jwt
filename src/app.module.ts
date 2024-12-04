import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import config from 'db/config'
import { AddressModule } from './address/address.module'
import { CoreModule } from './core/core.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [CoreModule, ConfigModule.forRoot({ isGlobal: true }), AddressModule, UserModule, SequelizeModule.forRoot(config)],
  controllers: [],
  providers: []
})
export class AppModule {}
