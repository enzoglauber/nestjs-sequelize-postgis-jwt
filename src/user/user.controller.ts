import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { log } from 'node:console'
import { Public } from 'src/auth/decorators/public.decorator'
import { ParseCommaPipe } from 'src/core/pipes/parse-comma.pipe'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserDto } from './dto/user.dto'
import { User } from './entities/user.entity'
import { UserService } from './user.service'

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({ type: UserDto })
  @ApiBody({ type: CreateUserDto, description: 'User body attributes' })
  create(@Body() user: CreateUserDto) {
    return this.userService.create(user)
  }

  @Public()
  @Get()
  @ApiOperation({ description: 'List users' })
  @ApiQuery({ name: 'page', description: 'Start from 1 to X', required: false })
  @ApiQuery({ name: 'limit', description: 'Number of elements in results', required: false })
  @ApiQuery({ name: 'name', description: 'Filter by name', required: false })
  @ApiQuery({ name: 'email', description: 'Filter by email', required: false })
  @ApiQuery({ name: 'roles', description: 'Filter by roles (comma-separated)', required: false, type: String })
  @ApiOkResponse({ type: User, isArray: true, description: `Users listed successfully.` })
  async findAll(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('roles', ParseCommaPipe) roles?: string[]
  ) {
    log('roles', roles)
    return this.userService.findAll({ page, limit, name, email, roles })
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
  async update(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDto) {
    return this.userService.update(id, user)
  }

  @Delete(':id')
  @ApiOkResponse({ type: UserDto })
  @ApiParam({ name: 'id', required: true })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id)
  }
}
