import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'
import { CreateAddressDto } from './create-address.dto'

export class UpdateAddressDto extends CreateAddressDto {
  @ApiPropertyOptional({
    description: 'User ID associated with the address',
    example: 1
  })
  @IsOptional()
  @IsNumber()
  userId: number
}
