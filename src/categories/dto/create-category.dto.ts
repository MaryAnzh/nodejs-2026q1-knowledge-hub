import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Technology' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Articles about modern technologies' })
  @IsString()
  description: string
}