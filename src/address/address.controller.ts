import { Body, Controller, Delete, Get, HttpStatus, Param, ParseFilePipe, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
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
  @ApiBody({ type: CreateAddressDto, description: 'Address body attributes' })
  create(@Body() address: CreateAddressDto) {
    return this.addressService.create(address)
  }

  @Get()
  @ApiOkResponse({ type: AddressDto, isArray: true })
  async findAll() {
    return this.addressService.findAll()
  }

  @Get('/location')
  @ApiOperation({
    description: 'List address with location'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'address listed with location'
  })
  @ApiQuery({ name: 'page', description: 'start from 1 to X' })
  @ApiQuery({ name: 'limit', description: 'number of element in results' })
  @ApiQuery({ name: 'at', description: 'lat,long', required: false })
  @ApiQuery({ name: 'radius', description: 'radius to search', required: false })
  @ApiOkResponse({ type: AddressDto, isArray: true })
  async findAllWithLocation(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('at') at?: string,
    @Query('radius', ParseFilePipe) radius?: number
  ) {
    return this.addressService.findAllWithLocation(page, limit, at, radius)
  }

  @Get(':id')
  @ApiOkResponse({ type: AddressDto })
  @ApiParam({ name: 'id', required: true })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.addressService.findOne(id)
  }

  @Patch(':id')
  @ApiOkResponse({ type: AddressDto })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateAddressDto, description: 'Address body attributes' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() address: UpdateAddressDto) {
    return this.addressService.update(id, address)
  }

  @Delete(':id')
  @ApiOkResponse({ type: AddressDto })
  @ApiParam({ name: 'id', required: true })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.addressService.delete(id)
  }
}
