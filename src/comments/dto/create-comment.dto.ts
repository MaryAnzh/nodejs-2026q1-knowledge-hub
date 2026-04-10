import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Nice article!', description: 'Comment text' })
  @IsString()
  content: string;

  @ApiProperty({
    example: '0a35dd62-e09f-444b-a628-f4e7c6954f57',
    description: 'ID of the article',
  })
  
  @IsUUID()
  articleId: string;

  @ApiProperty({
    example: null,
    description: 'ID of the author (nullable)',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsUUID()
  authorId: string | null;
}