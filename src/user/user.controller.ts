import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common'
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserDto } from './dto/user.dto'
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
  @ApiOkResponse({ type: User, isArray: true })
  async findAll() {
    return this.userService.findAll()
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
