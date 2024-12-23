import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { HashingService } from 'src/core/hashing/hashing.service'
import { LoggerService } from 'src/core/logger/logger.service'
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

  async validateUser(email: string, password: string): Promise<any> {
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

  // public async veryifyUserRefreshToken(refreshToken: string, userId: number): Promise<UserPayload | null> {
  //   const user = await this.userService.findOneByIdAndRefreshToken(userId, refreshToken).catch(() => null)

  //   if (!user) {
  //     this.loggerService.error('User not found')
  //     return null
  //   }

  //   return {
  //     id: user.id,
  //     email: user.email
  //   }
  // }

  // async signUp(signUpDto: SignUpDto) {
  //   const hashedPassword = await this.hashingService.hash(signUpDto.password)
  //   const [userWithEmail] = await this.drizzleService.db.select().from(schema.users).where(eq(schema.users.email, signUpDto.email))

  //   if (userWithEmail) {
  //     throw new BadRequestException('Email already used')
  //   }

  //   const [user] = await this.drizzleService.db
  //     .insert(schema.users)
  //     .values({
  //       ...signUpDto,
  //       password: hashedPassword
  //     })
  //     .returning()

  //   delete user.password
  //   return user
  // }

  public async signIn(user: UserPayload): Promise<{
    accessToken: string
    refreshToken: string
  }> {
    const [accessToken, refreshToken] = await Promise.all([this.generateAccessToken(user), this.generateRefreshToken(user)])

    // await this.userService.updateRefreshToken(user.id, refreshToken)

    return {
      accessToken,
      refreshToken
    }
  }

  private async generateAccessToken(userPayload: UserPayload): Promise<string> {
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

  private async generateRefreshToken(userPayload: UserPayload): Promise<string> {
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
  // public async validateUser({ email, password }: AuthInput): Promise<UserPayload | null> {
  //   const user = await this.userService.findByEmail(email)

  //   if (!user) {
  //     this.loggerService.error('User not found')
  //     return null
  //   }

  //   if (user.password !== password) {
  //     this.loggerService.error('Invalid password attempt')
  //     return null
  //   }

  //   return {
  //     id: user.id,
  //     email: user.email
  //   }
  // }

  // public async veryifyUserRefreshToken(refreshToken: string, userId: number): Promise<UserPayload | null> {
  //   const user = await this.usersService.findOneByIdAndRefreshToken(userId, refreshToken).catch(() => null)

  //   if (!user) {
  //     this.loggerService.error('User not found')
  //     return null
  //   }

  //   return {
  //     id: user.id,
  //     email: user.email
  //   }
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
  //   const [accessToken, refreshToken] = await Promise.all([this.generateAccessToken(userPayload), this.generateRefreshToken(userPayload)])

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

  // private async generateAccessToken(userPayload: UserPayload): Promise<string> {
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

  // private async generateRefreshToken(userPayload: UserPayload): Promise<string> {
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
