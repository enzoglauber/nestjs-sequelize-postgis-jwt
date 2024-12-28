import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { JwtAuthStrategy } from './strategies/jwt-auth.strategy'
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy'
import { LocalStrategy } from './strategies/local.strategy'

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
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
    AuthService,
    LocalStrategy,
    JwtAuthStrategy,
    JwtRefreshStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ],
  controllers: [AuthController]
})
export class AuthModule {}
