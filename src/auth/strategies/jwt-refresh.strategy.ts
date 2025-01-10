import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import { HashingService } from 'src/core/hashing/hashing.service'
import { LoggerService } from 'src/core/logger/logger.service'
import { UserService } from 'src/user/user.service'
import { UserPayload } from '../interfaces/request-with-user'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(JwtStrategy, 'jwt-refresh') {
  constructor(
    private readonly userService: UserService,
    private readonly loggerService: LoggerService,
    private readonly hashingService: HashingService,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_REFRESH'),
      passReqToCallback: true
    })
  }

  async validate(req: Request, payload: UserPayload) {
    const refreshToken = req.get('authorization')?.replace('Bearer ', '').trim()
    const user = await this.userService.findOne(payload.sub)
    delete user.password

    if (!user || !user.refreshToken) {
      this.loggerService.log(`User not found or no refresh token: ${payload.sub}`)
      throw new UnauthorizedException('User not found or no refresh token')
    }

    this.loggerService.log(`Validating refresh token for user: ${payload.sub}`)

    const refreshTokenMatches = await this.hashingService.compare(refreshToken, user.refreshToken)

    if (!refreshTokenMatches) {
      this.loggerService.log(`Refresh token mismatch for user: ${payload.sub}`)
      throw new UnauthorizedException('Refresh token mismatch')
    }

    return { ...user, refreshToken }
  }
}

// import { Injectable, UnauthorizedException } from '@nestjs/common'
// import { ConfigService } from '@nestjs/config'
// import { PassportStrategy } from '@nestjs/passport'
// import { Request } from 'express'
// import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
// import { LoggerService } from 'src/core/logger/logger.service'
// import { UserService } from 'src/user/user.service'

// @Injectable()
// export class JwtRefreshStrategy extends PassportStrategy(JwtStrategy, 'jwt-refresh') {
//   constructor(
//     private readonly userService: UserService,
//     private readonly loggerService: LoggerService,
//     private readonly configService: ConfigService
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: configService.get('JWT_REFRESH'),
//       passReqToCallback: true
//     })
//   }

//   // async validate(
//   //   request: Request,
//   //   payload: {
//   //     id: number
//   //     email: string
//   //   }
//   // ): Promise<UserPayload> {
//   //   const refreshToken = request.get('authorization')?.replace('Bearer ', '').trim()
//   //   this.loggerService.log(`JwtRefreshStrategy::::::::::::::::`, payload, refreshToken)
//   //   const userPayload = await this.authService.veryifyUserRefreshToken(refreshToken, payload.id)

//   //   if (!userPayload) {
//   //     throw new UnauthorizedException('Invalid Refresh Token')
//   //   }

//   //   return userPayload
//   // }

//   async validate(req: Request, payload: any) {
//     const refreshToken = req.get('authorization')?.replace('Bearer ', '').trim()
//     const me = await this.userService.findOne(payload.sub)

//     this.loggerService.log(`JwtRefreshStrategy::::::::::::::::`, me.refreshToken)
//     if (me && me.refreshToken) {
//       return { ...payload, id: payload.sub, refreshToken }
//     } else {
//       throw new UnauthorizedException()
//     }
//   }
// }

// import { Injectable } from '@nestjs/common'
// import { ConfigService } from '@nestjs/config'
// import { PassportStrategy } from '@nestjs/passport'
// import { Request } from 'express'
// import { ExtractJwt, Strategy } from 'passport-jwt'
// import { LoggerService } from 'src/core/logger/logger.service'
// import { UserService } from 'src/user/user.service'
// import { AuthService } from '../auth.service'

// @Injectable()
// export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
//   constructor(
//     private readonly loggerService: LoggerService,
//     private readonly authService: AuthService,
//     private readonly userService: UserService,
//     private readonly configService: ConfigService
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: configService.get('JWT_REFRESH'),
//       passReqToCallback: true
//     })
//   }

//   async validate(req: Request, payload: UserPayload) {
//     this.loggerService.log(`JwtRefreshStrategy`, payload)
//     const refreshToken = req.get('authorization')?.replace('Bearer ', '').trim()
//     // const me = await this.userService.findOne(payload.id)
//     // if (me && me.refreshToken) {
//     //   return { ...payload, ...me, refreshToken }
//     // } else {
//     //   throw new UnauthorizedException()
//     // }
//     return { ...payload, refreshToken }
//   }

//   // async validate(req: Request, payload: any) {
//   //   if (me && me.refreshToken) {
//   //     if (payload.expiresIn > moment().unix()) {
//   //       return { ...payload, ...me, refresh_token: req.get('authorization') }
//   //     }
//   //   }
//   //   throw new UnauthorizedException()
//   // }
// }
