import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'
import { User } from '../entities/user.entity'

export class CreateUserDto {
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
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string

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
  toEntity(): Partial<User> {
    const base = { ...this }
    return {
      ...base
    }
  }
}
