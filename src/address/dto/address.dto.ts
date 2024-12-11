import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'

export class AddressDto {
  @ApiProperty({
    description: 'ID of the address',
    example: 1
  })
  id: number

  @ApiProperty({
    description: 'Name or label for the address',
    example: 'Home Address'
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    description: 'Coordinates of the address',
    example: [-46.49303586178094, -23.5069054086106]
  })
  @Transform(({ value }) => value?.coordinates)
  location: [number, number]

  constructor(partial: Partial<AddressDto>) {
    Object.assign(this, partial)
  }
}
