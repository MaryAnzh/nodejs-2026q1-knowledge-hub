import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsUUID, IsIn } from 'class-validator';
import { ArticleStatus } from '@prisma/client';

import { DRAFT } from '../../constants';

export class CreateArticleDto {
  @ApiProperty({
    example: 'My first article',
    description: 'Title of the article',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'This is the content of the article...',
    description: 'Full text content of the article',
  })
  @IsString()
  content: string;

  @ApiPropertyOptional({
    enum: ArticleStatus,
    example: DRAFT,
    description: 'Status of the article',
  })
  @IsOptional()
  @IsIn(Object.values(ArticleStatus))
  status?: ArticleStatus;

  @ApiPropertyOptional({
    example: null,
    nullable: true,
    description: 'Author ID (nullable)',
  })
  @IsOptional()
  @IsUUID()
  authorId?: string | null;

  @ApiPropertyOptional({
    example: null,
    nullable: true,
    description: 'Category ID (nullable)',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string | null;

  @ApiPropertyOptional({
    type: [String],
    example: ['nodejs', 'typescript'],
    description: 'List of tag names',
  })
  @IsOptional()
  @IsArray()
  tags?: string[];
}