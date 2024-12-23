import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AddressModule } from './address/address.module'
import { AuthModule } from './auth/auth.module'
import { CoreModule } from './core/core.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [CoreModule, ConfigModule.forRoot({ isGlobal: true }), AuthModule, AddressModule, UserModule],
  controllers: [],
  providers: []
})
export class AppModule {}
