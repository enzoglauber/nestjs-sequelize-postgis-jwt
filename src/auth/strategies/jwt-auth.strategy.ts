import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { LoggerService } from 'src/core/logger/logger.service'
import { UserService } from 'src/user/user.service'
@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_TOKEN')
    })
  }

  async validate(payload: { sub: number; username: string }) {
    const user = await this.userService.findOne(payload.sub)
    delete user.password
    if (!user || !user.refreshToken) {
      this.loggerService.log(`User not found or no refresh token: ${payload.sub}`)
      throw new UnauthorizedException('User not found or no refresh token')
    }
    return { ...user }
  }

  // async validate(payload: any) {
  //   const me = await this.userService.getMySelf(payload?.id);
  //   if (
  //     me &&
  //     ArrayHelper.compareArrayElements(
  //       me.roles.map((role) => role.name),
  //       payload.roles.map((role) => role.name),
  //     )
  //   ) {
  //     if (payload.expiresIn > moment().unix()) {
  //       return me;
  //     }
  //   }
  //   throw new UnauthorizedException();
  // }
}

// import { Injectable } from '@nestjs/common'
// import { PassportStrategy } from '@nestjs/passport'
// import { Request } from 'express'
// import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
// import { jwtConstants } from '../config/constants'

// @Injectable()
// export class JwtCookieStrategy extends PassportStrategy(JwtStrategy) {
//   constructor() {
//     super({
//       jwtFromRequest: ExtractJwt.fromExtractors([
//         (request: Request) => {
//           let token = null
//           if (request && request.cookies) {
//             token = request.cookies['access_token']
//           }
//           return token
//         }
//       ]),
//       ignoreExpiration: false,
//       secretOrKey: jwtConstants.secret
//     })
//   }

//   async validate(payload: { sub: number; email: string }): Promise<UserPayload> {
//     return { id: payload.sub, email: payload.email }
//   }
// }
