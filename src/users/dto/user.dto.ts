import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'Username of the user',
    example: 'john_doe',
    minLength: 4,
    maxLength: 20,
  })
  @IsString()
  @MinLength(4, { message: 'Username must be at least 4 characters long' })
  @MaxLength(20, { message: 'Username cannot be longer than 20 characters' })
  username: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'securePass123',
    minLength: 6,
    maxLength: 50,
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(50, { message: 'Password cannot be longer than 50 characters' })
  password: string;
}