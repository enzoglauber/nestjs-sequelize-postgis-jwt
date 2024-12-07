import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'
import { AddressService } from './address.service'
import { Address } from './entities/address.entity'

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}
  // @Post()
  // create(@Body() createAddressDto: CreateAddressDto) {
  //   return this.addressService.create(createAddressDto)
  // }

  @Get()
  @ApiOkResponse({ type: Address, isArray: true })
  async findAll() {
    return this.addressService.findAll()
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.addressService.findOne(+id)
  // }
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
  //   return this.addressService.update(+id, updateAddressDto)
  // }
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.addressService.remove(+id)
  // }
}
