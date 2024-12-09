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
        location: [-46.49303586178094, -23.5069054086106]
      },
      {
        id: 2,
        name: 'Work Address',
        location: [-46.6204254, -23.5506837]
      }
    ]
  })
  @IsOptional()
  @IsArray()
  addresses?: AddressDto[]

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial)
    if (partial.addresses) {
      this.addresses = partial.addresses.map((address) => new AddressDto(address))
    }
  }
}
