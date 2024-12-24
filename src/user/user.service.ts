import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
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

  async findAll(page: number = 1, limit: number = 10): Promise<UserDto[]> {
    const users = await this.userRepository.findAll({
      limit,
      offset: (page - 1) * limit,
      // where: {
      //   [Op.or]
      // }
      include: [
        {
          model: Address,
          required: false
        }
      ]
    })

    return users.map((user) => new UserDto(user.get({ plain: true })))
  }

  // async findAll(page: number = 1, limit: number = 10, at?: [number, number], radius: number = 0.015): Promise<UserDto[]> {
  //   const [lat, lng] = at || []
  //   const location = literal(`ST_SetSRID(ST_GeomFromText('POINT(${lat} ${lng})'), 4326)`)
  //   const distance = fn('ST_Distance', col('addresses.location'), location)

  //   const users = await this.userRepository.findAll({
  //     limit,
  //     offset: (page - 1) * limit,
  //     include: [
  //       {
  //         model: Address,
  //         required: true,
  //         attributes: {
  //           include: [[distance, 'distance']]
  //         },
  //         where: fn('ST_DWithin', col('addresses.location'), location, radius)
  //       }
  //     ],
  //     order: [[literal('"addresses.distance"'), 'ASC']] // Certifique-se de usar aspas adequadas para o alias
  //   })

  //   return users.map((user) => new UserDto(user.get({ plain: true })))
  // }

  // async findAll(page: number = 1, limit: number = 10, at?: [number, number], radius: number = 0.015): Promise<UserDto[]> {
  //   const [lat, lng] = at || []
  //   const location = literal(`ST_SetSRID(ST_GeomFromText('POINT(${lat} ${lng})'), 4326)`)
  //   const distance = fn('ST_Distance', col('Addresses.location'), location)

  //   const users = await this.userRepository.findAll({
  //     limit,
  //     offset: (page - 1) * limit,
  //     include: [
  //       {
  //         model: Address,
  //         required: true, // Filtra usuários com endereço correspondente
  //         attributes: [...Object.keys(Address.getAttributes()), [distance, 'distance']],
  //         where: fn('ST_DWithin', col('Addresses.location'), location, radius)
  //       }
  //     ],
  //     order: [[literal('"Addresses.distance"'), 'ASC']] // Ordena pelo endereço mais próximo
  //   })

  //   return users.map((user) => new UserDto(user.get({ plain: true })))
  // }

  // public async updateRefreshToken(id: number, token: string): Promise<void> {
  //   const user = await this.findOne(id)
  //   if (!user) {
  //     throw new NotFoundException(`User not found by id: ${id}`)
  //   }

  //   const refreshToken = await this.hashingService.hash(token)
  //   await this.update(id, { refreshToken })
  // }

  // public async findOneByIdAndRefreshToken(id: number, refreshToken: string): Promise<User> {
  //   const user = await this.entity(id)

  //   if (!user) {
  //     this.loggerService.error(`User not found by id: ${id}`)
  //     throw new NotFoundException('User not found by id')
  //   }

  //   const tokenValid = await this.hashingService.compare(refreshToken, user.refreshToken)
  //   this.loggerService.log(id, refreshToken, user.refreshToken, `=`, tokenValid)

  //   if (!tokenValid) {
  //     this.loggerService.error(`Invalid refresh token for user id: ${id}`)
  //     throw new NotFoundException('Invalid refresh token')
  //   }

  //   return user
  // }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne<User>({ where: { email }, include: [Address] })
    // if (!user) {
    //   throw new HttpException(`User not found by email: ${email}`, HttpStatus.NOT_FOUND)
    // }
    return new UserDto(user.get({ plain: true }))
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
