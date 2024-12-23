import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Request as RequestType } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT, ExtractJwt.fromAuthHeaderAsBearerToken()]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_TOKEN')
    })
  }

  async validate(payload: { sub: number }) {
    return { userId: payload.sub }
  }

  private static extractJWT(request: RequestType): string | null {
    if (request.cookies && 'access_token' in request.cookies && request.cookies.access_token.length > 0) {
      return request.cookies.access_token
    }
    return null
  }
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
