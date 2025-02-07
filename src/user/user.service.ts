import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { Op } from 'sequelize'
import { Address } from 'src/address/entities/address.entity'
import { HashingService } from 'src/core/hashing/hashing.service'
import { LoggerService } from 'src/core/logger/logger.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserDto } from './dto/user.dto'
import { User } from './entities/user.entity'
import { USER_REPOSITORY } from './users.providers'
// import { Op } from 'sequelize'

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
    private readonly hashingService: HashingService,
    private readonly loggerService: LoggerService
  ) {}

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

  async findAll({
    page = 1,
    limit = 10,
    name,
    email,
    roles
  }: {
    page: number
    limit: number
    name?: string
    email?: string
    roles?: string
  }): Promise<UserDto[]> {
    const where: any = {}

    if (name) {
      where.name = { [Op.iLike]: `%${name}%` }
    }

    if (email) {
      where.email = { [Op.iLike]: `%${email}%` }
    }

    if (roles) {
      const overlap = roles.split(',')
      where.roles = { [Op.overlap]: overlap }
    }

    const users = await this.userRepository.findAll({
      limit,
      offset: (page - 1) * limit,
      where,
      include: [
        {
          model: Address,
          required: false
        }
      ]
    })

    return users.map((user) => new UserDto(user.get({ plain: true })))
  }

  async findByEmail(email: string): Promise<UserDto> | null {
    const user = await this.userRepository.findOne<User>({ where: { email }, include: [Address] })
    return user ? new UserDto(user.get({ plain: true })) : null
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
