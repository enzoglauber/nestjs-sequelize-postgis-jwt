import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { log } from 'node:console'
import { HashingService } from 'src/core/hashing/hashing.service'
import { LoggerService } from 'src/core/logger/logger.service'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { UserService } from 'src/user/user.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService
  ) {
    this.loggerService.setContext(AuthService.name)
  }

  async signUp(signUpDto: CreateUserDto) {
    const user = await this.userService.findByEmail(signUpDto.email)
    if (user) {
      throw new HttpException(`User already registered: ${signUpDto.email}`, HttpStatus.NOT_FOUND)
    }

    return await this.userService.create(signUpDto)
  }

  async login(user: UserPayload): Promise<{
    accessToken: string
    refreshToken: string
  }> {
    const { accessToken, refreshToken } = await this.getTokens(user)
    await this.updateRefreshToken(user.id, refreshToken)

    return {
      accessToken,
      refreshToken
    }
  }

  private async getTokens(user: UserPayload) {
    const [accessToken, refreshToken] = await Promise.all([this.getAccessToken(user), this.getRefreshToken(user)])

    return {
      accessToken,
      refreshToken
    }
  }

  private async getAccessToken(userPayload: UserPayload): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: userPayload.id,
        email: userPayload.email
      },
      {
        secret: this.configService.get('JWT_TOKEN'),
        expiresIn: this.configService.get('JWT_TOKEN_TTL')
      }
    )
  }

  private async getRefreshToken(userPayload: UserPayload): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: userPayload.id,
        email: userPayload.email
      },
      {
        secret: this.configService.get('JWT_REFRESH'),
        expiresIn: this.configService.get('JWT_REFRESH_TTL')
      }
    )
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await await this.userService.findByEmail(email)

    if (!user) {
      throw new BadRequestException('Invalid credentials')
    }

    const isPasswordValid = await this.hashingService.compare(password, user.password)

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials')
    }

    delete user.password
    return user
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userService.findOne(userId)
    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied')

    log(`refreshTokens`, refreshToken)
    log(`refreshTokens2`, user)
    const refreshTokenMatches = await this.hashingService.compare(refreshToken, user.refreshToken)
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Tokens do not match')
    }
    const tokens = await this.getTokens(user)
    await this.updateRefreshToken(user.id, tokens.refreshToken)

    return tokens
  }

  private async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashingService.hash(refreshToken)

    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken
    })
  }

  async logout(userId: number) {
    return this.userService.update(userId, { refreshToken: null })
  }

  // public async refreshToken(userId: number, refreshToken: string) {
  //   this.loggerService.log(`refreshToken`, userId, refreshToken)
  //   const user = await this.findOneByIdAndRefreshToken(userId, refreshToken).catch(() => null)

  //   if (!user) {
  //     this.loggerService.error('User not found')
  //     return null
  //   }

  //   return {
  //     id: user.id,
  //     email: user.email
  //   }
  // }

  // private async findOneByIdAndRefreshToken(id: number, refreshToken: string): Promise<UserDto> {
  //   const user = await this.userService.findOne(id)
  //   if (!user) {
  //     this.loggerService.error(`User not found with id: ${id}`)
  //     throw new NotFoundException('User not found')
  //   }

  //   const isValid = await this.hashingService.compare(refreshToken, user.refreshToken)
  //   if (!isValid) {
  //     this.loggerService.error('Invalid refresh token')
  //     throw new ForbiddenException('Invalid refresh token')
  //   }

  //   return user
  // }

  // public async veryifyUserEmail(email: string): Promise<UserPayload | null> {
  //   const user = await this.usersService.findOneByEmail(email).catch(() => null)

  //   if (!user) {
  //     this.loggerService.error('User not found')
  //     return null
  //   }

  //   return {
  //     id: user.id,
  //     email: user.email
  //   }
  // }

  // public async signIn(userPayload: UserPayload): Promise<{
  //   accessToken: string
  //   refreshToken: string
  // }> {
  //   const [accessToken, refreshToken] = await Promise.all([this.getAccessToken(userPayload), this.getRefreshToken(userPayload)])

  //   await this.usersService.updateRefreshToken(userPayload.id, refreshToken)

  //   return {
  //     accessToken,
  //     refreshToken
  //   }
  // }

  // private async signToken<T>(userId: number, payload?: T) {
  //   return this.jwtService.signAsync({
  //     sub: userId,
  //     ...payload
  //   })
  // }

  // async generateTokens(userId: number) {
  //   const user = await this.userService.findOne(userId)
  //   // const [user] = await this.drizzleService.db.select().from(schema.users).where(eq(schema.users.id, userId))
  //   const [accessToken] = await Promise.all([
  //     await this.signToken(user.id, {
  //       email: user.email
  //     })
  //   ])
  //   return {
  //     accessToken
  //   }
  // }

  // private async getAccessToken(userPayload: UserPayload): Promise<string> {
  //   return this.jwtService.signAsync(
  //     {
  //       sub: userPayload.id,
  //       email: userPayload.email
  //     },
  //     {
  //       secret: jwtConstants.secret,
  //       expiresIn: '60s'
  //     }
  //   )
  // }

  // private async getRefreshToken(userPayload: UserPayload): Promise<string> {
  //   return this.jwtService.signAsync(
  //     {
  //       sub: userPayload.id,
  //       email: userPayload.email
  //     },
  //     {
  //       secret: jwtConstants.refreshSecret,
  //       expiresIn: '7d'
  //     }
  //   )
  // }
}
