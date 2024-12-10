import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AddressService } from './address.service'
import { AddressDto } from './dto/address.dto'
import { CreateAddressDto } from './dto/create-address.dto'

@Controller('address')
@ApiTags('Address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @ApiCreatedResponse({ type: AddressDto })
  create(@Body() address: CreateAddressDto) {
    return this.addressService.create(address)
  }

  @Get()
  @ApiOkResponse({ type: AddressDto, isArray: true })
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
