import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Get()
  // @ApiOkResponse({ type: User, isArray: true })
  async findAll() {
    return this.userService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id)
  }

  // @Post()
  // @ApiCreatedResponse({ type: UserEntity })
  // async create(@Body() createUserDto: CreateUserDto) {
  //   return new UserEntity(await this.userService.create(createUserDto))
  // }

  // @Get()
  // @ApiOkResponse({ type: UserEntity, isArray: true })
  // async findAll() {
  //   const users = await this.userService.findAll()
  //   return users.map((user) => new UserEntity(user))
  // }

  // @Get(':id')
  // @ApiOkResponse({ type: UserEntity })
  // async findOne(@Param('id', ParseIntPipe) id: number) {
  //   return new UserEntity(await this.userService.findOne(id))
  // }

  // @Patch(':id')
  // @ApiCreatedResponse({ type: UserEntity })
  // async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
  //   return new UserEntity(await this.userService.update(id, updateUserDto))
  // }

  // @Delete(':id')
  // @ApiOkResponse({ type: UserEntity })
  // async remove(@Param('id', ParseIntPipe) id: number) {
  //   return new UserEntity(await this.userService.remove(id))
  // }

  // @Get()
  // @ApiOperation({
  //     description: 'List properties',
  //     tags: ['Properties'],
  // })
  // @ApiResponse({
  //     status: HttpStatus.OK,
  //     description: 'properties listed',
  // })
  // @ApiImplicitQuery({name: 'at', description: 'lat,long'})
  // @ApiImplicitQuery({name: 'limit', description: 'number of element in results'})
  // @ApiImplicitQuery({name: 'page', description: 'start from 1 to X'})
  // async findAll(
  //     @Query('limit') limit = 10,
  //     @Query('page') page = 1,
  //     @Query('at') at?: string) {
  //     return await this.propertyService.findAll(limit, page, at);
  // }
}
