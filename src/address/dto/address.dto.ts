import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

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
export class AddressFullyDto extends AddressDto {
  @ApiProperty({
    description: 'Distance from the queried location to the address, calculated based on geographical coordinates.',
    example: 1.5,
    type: Number
  })
  @IsNumber({}, { message: 'The distance must be a valid number.' })
  @Transform(({ value }) => value * 100, { toPlainOnly: true }) // Garante que a transformação ocorre somente ao serializar
  distance: number
}
