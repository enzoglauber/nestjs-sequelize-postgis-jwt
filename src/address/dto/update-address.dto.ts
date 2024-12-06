import { PartialType } from '@nestjs/mapped-types'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'
import { CreateAddressDto } from './create-address.dto'

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  id: number
}
