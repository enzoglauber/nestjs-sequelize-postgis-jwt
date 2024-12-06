import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateAddressDto {
  @ApiProperty({
    description: 'Name of the address',
    example: 'Home'
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    description: 'Location in WKT (Well-Known Text) format',
    example: 'POINT(-73.935242 40.73061)'
  })
  @IsNotEmpty()
  @IsString()
  location: string

  @ApiProperty({
    description: 'User ID associated with the address',
    example: 1
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number
}
