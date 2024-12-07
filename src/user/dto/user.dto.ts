import { Exclude } from 'class-transformer'

import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'
import { AddressDto } from 'src/address/dto/address.dto'

export class UserDto {
  @ApiProperty({
    description: 'ID of the user',
    example: 1
  })
  id: number

  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe'
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    description: 'Email of the user',
    example: 'johndoe@example.com'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Password of the user',
    example: 'X%^32La@'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Exclude()
  password: string

  @ApiProperty({
    description: 'List of addresses associated with the user',
    type: [AddressDto],
    example: [
      {
        id: 1,
        name: 'Home Address',
        location: 'POINT(-46.5244254 -23.5356837)'
      },
      {
        id: 2,
        name: 'Work Address',
        location: 'POINT(-46.6204254 -23.5506837)'
      }
    ]
  })
  @IsOptional()
  @IsArray()
  addresses?: AddressDto[] // Campo opcional

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial)
  }
}
