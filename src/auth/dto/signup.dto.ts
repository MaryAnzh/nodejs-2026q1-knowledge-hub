import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ example: 'john_doe' })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  login: string;

  @ApiProperty({ example: 'strong_password_123' })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  password: string;
}