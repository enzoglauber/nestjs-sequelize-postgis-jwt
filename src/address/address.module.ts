import { Module } from '@nestjs/common'
import { AddressController } from './address.controller'
import { addressProviders } from './address.providers'
import { AddressService } from './address.service'

@Module({
  providers: [AddressService, ...addressProviders],
  controllers: [AddressController],
  exports: [AddressService]
})
export class AddressModule {}
