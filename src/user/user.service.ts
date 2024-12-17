import { Inject, Injectable } from '@nestjs/common'
import { Address } from 'src/address/entities/address.entity'
import { HashingService } from 'src/core/hashing/hashing.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserDto } from './dto/user.dto'
import { User } from './entities/user.entity'
import { USER_REPOSITORY } from './users.providers'

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
    private readonly hashingService: HashingService
    // private readonly configService: ConfigService
  ) {
    // this.jwtPrivateKey = this.configService.jwtConfig.privateKey
  }

  async create(createUserDto: CreateUserDto) {
    const user = createUserDto.toEntity()
    user.password = await this.hashingService.hash(user.password)
    const created = await this.userRepository.create<User>(user)
    return new UserDto(created.get({ plain: true }))
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.userRepository.findAll({ include: [Address] })
    return users.map((user) => new UserDto(user.get({ plain: true })))
  }

  findOne(id: number) {
    return `This action returns a #${id} user`
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
