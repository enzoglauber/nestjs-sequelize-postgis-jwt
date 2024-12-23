import { Global, Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { userProviders } from './users.providers'

@Global()
@Module({
  providers: [UserService, ...userProviders],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
