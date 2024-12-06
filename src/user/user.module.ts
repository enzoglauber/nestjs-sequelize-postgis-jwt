import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { usersProviders } from './users.providers'

@Module({
  providers: [UserService, ...usersProviders],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}

// import {Module} from '@nestjs/common';
// import {BookingsService} from './bookings.service';
// import {BookingsController} from './bookings.controller';
// import {bookingsProviders} from "./bookings.providers";
// import { usersProviders } from './users.providers';

// @Module({
//     providers: [BookingsService, ...bookingsProviders],
//     controllers: [BookingsController],
//     exports: [BookingsService]
// })
// export class BookingsModule {
// }
