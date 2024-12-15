import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { ParseAtPipe } from 'src/core/pipes/parse-at.pipe'
import { ParseRadiusPipe } from 'src/core/pipes/parse-radius.pipe'
import { AddressService } from './address.service'
import { AddressDto, AddressFullyDto } from './dto/address.dto'
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
    description: 'List addresses near a location with radius'
  })
  @ApiQuery({ name: 'page', description: 'Start from 1 to X', required: false })
  @ApiQuery({ name: 'limit', description: 'Number of elements in results', required: false })
  @ApiQuery({
    name: 'at',
    description: 'Coordinates in the format lat,long (e.g., -23.53506,-46.525199)',
    type: String
  })
  @ApiQuery({
    name: 'radius',
    description: 'Radius in kilometers to search for addresses',
    type: Number
  })
  @ApiOkResponse({ type: AddressFullyDto, isArray: true, description: 'Addresses listed successfully with location details.' })
  async findAllWithLocation(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('at', ParseAtPipe) at: [number, number],
    @Query('radius', ParseRadiusPipe) radius: number
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
