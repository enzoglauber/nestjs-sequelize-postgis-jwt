import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { ParseAtPipe } from 'src/core/pipes/parse-at.pipe'
import { ParseRadiusPipe } from 'src/core/pipes/parse-radius.pipe'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserDto, UserFullyDto } from './dto/user.dto'
import { User } from './entities/user.entity'
import { UserService } from './user.service'

@Controller('user')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({ type: UserDto })
  @ApiBody({ type: CreateUserDto, description: 'User body attributes' })
  create(@Body() user: CreateUserDto) {
    return this.userService.create(user)
  }

  @Get()
  @ApiOperation({
    description: 'List users with addresses near a location with radius'
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
    description: `Radius in kilometers to search for user's addresses`,
    type: Number
  })
  @ApiOkResponse({ type: UserFullyDto, isArray: true, description: `User's Addresses listed successfully with location details.` })
  @ApiOkResponse({ type: User, isArray: true })
  async findAll(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('at', ParseAtPipe) at: [number, number],
    @Query('radius', ParseRadiusPipe) radius: number
  ) {
    return this.userService.findAll(page, limit, at, radius)
  }

  @Get(':id')
  @ApiOkResponse({ type: UserDto })
  @ApiParam({ name: 'id', required: true })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id)
  }

  @Patch(':id')
  @ApiOkResponse({ type: UserDto })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateUserDto, description: 'User body attributes' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() address: UpdateUserDto) {
    return this.userService.update(id, address)
  }

  @Delete(':id')
  @ApiOkResponse({ type: UserDto })
  @ApiParam({ name: 'id', required: true })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id)
  }
}
