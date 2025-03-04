import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Username of the user',
    minLength: 3,
    maxLength: 20,
    example: 'john_doe',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @ApiProperty({
    description: 'Password of the user',
    minLength: 6,
    example: 'strongPassword123',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'admin', description: 'Papel do usuário (admin ou user)' })
  @IsString()
  role: string;
}