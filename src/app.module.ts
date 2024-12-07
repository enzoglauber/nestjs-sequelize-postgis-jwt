import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AddressModule } from './address/address.module'
import { CoreModule } from './core/core.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [CoreModule, ConfigModule.forRoot({ isGlobal: true }), AddressModule, UserModule],
  controllers: [],
  providers: []
})
export class AppModule {}
