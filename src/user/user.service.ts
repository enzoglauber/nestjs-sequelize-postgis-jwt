import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { log } from 'node:console'
import { col, fn, literal } from 'sequelize'
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

  private async entity(id: number) {
    const user = await this.userRepository.findByPk<User>(id, { include: [Address] })
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
    return user
  }

  async create(user: CreateUserDto) {
    user.password = await this.hashingService.hash(user.password)
    const created = await this.userRepository.create<User>({ ...user })
    return new UserDto(created.get({ plain: true }))
  }

  async findAll(page: number = 1, limit: number = 10, at?: [number, number], radius: number = 0.015): Promise<UserDto[]> {
    const [lat, lng] = at
    const location = literal(`ST_SetSRID(ST_GeomFromText('POINT(${lat} ${lng})'), 4326)`)
    const distance = fn('ST_Distance', col('location'), location)
    const attributes: any[] = [...Object.keys(Address.getAttributes()), [distance, 'distance']]

    log('attributes', attributes, radius)

    const users = await this.userRepository.findAll({ limit, offset: (page - 1) * limit, include: [Address] })
    // const users = await this.userRepository.findAll({ include: [Address] })
    return users.map((user) => new UserDto(user.get({ plain: true })))
  }

  async findOne(id: number) {
    const user = await this.entity(id)
    return new UserDto(user.get({ plain: true }))
  }

  async update(id: number, updated: UpdateUserDto) {
    const user = await this.entity(id)

    await user.update({ ...updated })
    return new UserDto(user.get({ plain: true }))
  }

  async delete(id: number) {
    const user = await this.entity(id)
    await user.destroy()
    return new UserDto(user.get({ plain: true }))
  }
}
