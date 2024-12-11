import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AddressService } from './address.service'
import { AddressDto } from './dto/address.dto'
import { CreateAddressDto } from './dto/create-address.dto'
import { UpdateAddressDto } from './dto/update-address.dto'

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

  @Patch(':id')
  @ApiCreatedResponse({ type: AddressDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() address: UpdateAddressDto) {
    return this.addressService.update(id, address)
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.addressService.remove(+id)
  // }
}
