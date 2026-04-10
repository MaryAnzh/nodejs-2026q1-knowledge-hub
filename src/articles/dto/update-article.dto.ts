import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsUUID, IsEnum } from 'class-validator';
import { ArticleStatus } from '@prisma/client';

export class UpdateArticleDto {
  @ApiPropertyOptional({
    example: 'Updated title',
    description: 'New title of the article',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'Updated content...',
    description: 'New content of the article',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    enum: Object.values(ArticleStatus),
    example: 'published',
    description: 'Updated article status',
  })
  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;

  @ApiPropertyOptional({
    example: null,
    nullable: true,
    description: 'Updated author ID (nullable)',
  })
  @IsOptional()
  @IsUUID()
  authorId?: string | null;

  @ApiPropertyOptional({
    example: null,
    nullable: true,
    description: 'Updated category ID (nullable)',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string | null;

  @ApiPropertyOptional({
    type: [String],
    example: ['updated', 'nestjs'],
    description: 'Updated list of tag names',
  })
  @IsOptional()
  @IsArray()
  tags?: string[];
}