import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from 'src/auth/decorators/roles.decorator'
import { UserRole } from '../enums/user-role.enum'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [context.getHandler(), context.getClass()])

    if (!required) {
      return true
    }

    const { user } = context.switchToHttp().getRequest()

    console.log(user)
    if (!user || !required.some((role) => user.roles?.includes(role))) {
      throw new UnauthorizedException('Access denied')
    }

    return true
  }
}
