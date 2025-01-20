import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'
import { UserRole } from 'src/core/enums/user-role.enum'

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
    description: 'Refresh token of the user',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @IsString()
  @IsOptional()
  refreshToken?: string

  @ApiProperty({
    description: 'Password of the user',
    example: 'X%^32La@'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string

  @ApiProperty({
    description: 'Roles assigned to the user',
    enum: UserRole,
    isArray: true,
    example: [UserRole.USER]
  })
  @IsArray()
  @IsEnum(UserRole, { each: true })
  roles: UserRole[]
}
