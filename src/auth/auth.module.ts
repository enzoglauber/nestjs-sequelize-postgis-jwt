import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtGuard } from './guards/jwt.guard'
// import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy'
import { log } from 'node:console'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        log(configService.get<string>('JWT_TOKEN'))
        log(configService.get<string>('JWT_TOKEN_TTL'))
        log(`configService.get<string>('JWT_TOKEN_TTL')`)
        return {
          secret: configService.get<string>('JWT_TOKEN'),
          signOptions: {
            expiresIn: configService.get<string>('JWT_TOKEN_TTL')
          }
        }
      },
      inject: [ConfigService]
    })
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard
    },
    AuthService,
    LocalStrategy,
    // JwtRefreshStrategy,
    JwtStrategy
  ],
  controllers: [AuthController]
})
export class AuthModule {}
