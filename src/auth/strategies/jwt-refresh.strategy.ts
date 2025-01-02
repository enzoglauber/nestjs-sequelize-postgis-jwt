import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import { LoggerService } from 'src/core/logger/logger.service'
import { UserService } from 'src/user/user.service'
import { AuthService } from '../auth.service'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(JwtStrategy, 'jwt-refresh') {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_REFRESH'),
      passReqToCallback: true
    })
  }

  // async validate(
  //   request: Request,
  //   payload: {
  //     id: number
  //     email: string
  //   }
  // ): Promise<UserPayload> {
  //   const refreshToken = request.get('authorization')?.replace('Bearer ', '').trim()
  //   this.loggerService.log(`JwtRefreshStrategy::::::::::::::::`, payload, refreshToken)
  //   const userPayload = await this.authService.veryifyUserRefreshToken(refreshToken, payload.id)

  //   if (!userPayload) {
  //     throw new UnauthorizedException('Invalid Refresh Token')
  //   }

  //   return userPayload
  // }

  async validate(req: Request, payload: any) {
    const refreshToken = req.get('authorization')?.replace('Bearer ', '').trim()
    const me = await this.userService.findOne(payload.sub)

    this.loggerService.log(`JwtRefreshStrategy::::::::::::::::`, me.refreshToken, 'LEGAL')
    if (me && me.refreshToken) {
      return { ...payload, id: payload.sub, refreshToken }
    } else {
      throw new UnauthorizedException()
    }
  }
}

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
