import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { fn } from 'sequelize'
import { Address } from '../entities/address.entity'

export class CreateAddressDto {
  @ApiProperty({
    description: 'Name of the address',
    example: 'Home'
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    description: 'Coordinates of the address',
    example: [-46.49303586178094, -23.5069054086106]
  })
  @IsOptional()
  @IsArray()
  location?: [number, number]

  @ApiProperty({
    description: 'User ID associated with the address',
    example: 1
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number

  /**
   * Converte o DTO em um objeto compatível com o modelo Sequelize.
   *
   * Este método transforma as propriedades do DTO em um formato adequado
   * para ser utilizado pelo Sequelize. Em particular, a propriedade `location`,
   * que é representada como um array de coordenadas no DTO (latitude e longitude),
   * é convertida para um formato geométrico (`GEOMETRY`) utilizando a função
   * `ST_GeomFromText` do Sequelize.
   *
   * @returns Um objeto parcial do modelo `Address`, pronto para ser utilizado
   *          em operações do Sequelize, como criação ou atualização no banco de dados.
   */
  toEntity(): Partial<Address> {
    const base = { ...this }
    return {
      ...base,
      location: this.location ? fn('ST_GeomFromText', `POINT(${this.location[0]} ${this.location[1]})`, 4326) : null
    }
  }
}
