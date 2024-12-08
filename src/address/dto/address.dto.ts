import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Transform } from 'class-transformer'
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
  @Exclude()
  name: string

  // @ApiProperty({
  //   description: 'Geographical location of the address in GeoJSON format',
  //   example: 'POINT(-46.5244254 -23.5356837)'
  // })
  // @IsNotEmpty()
  // @IsString()
  // location: string

  @ApiProperty({
    description: 'Coordinates of the address',
    example: [-46.49303586178094, -23.5069054086106]
  })
  @Transform(({ value }) => value?.coordinates)
  location: [number, number]

  // @ApiProperty({
  //   description: 'Additional details about the address (optional)',
  //   example: 'Apartment 301, Block B'
  // })
  // @IsOptional()
  // @IsString()
  // @Exclude()
  // details?: string

  constructor(partial: Partial<AddressDto>) {
    Object.assign(this, partial)
  }
}
