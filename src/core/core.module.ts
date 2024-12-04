import { Global, Module } from '@nestjs/common'
import { BcryptService } from './bcrypt/bcrypt.service'
import { HashingService } from './hashing/hashing.service'
import { LoggerService } from './logger/logger.service'

@Global()
@Module({
  providers: [{ provide: HashingService, useClass: BcryptService }, LoggerService],
  exports: [HashingService, LoggerService]
})
export class CoreModule {}
