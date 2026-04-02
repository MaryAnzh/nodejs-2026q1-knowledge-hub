import { IsString, IsOptional, IsEnum, IsArray, IsUUID, IsIn } from 'class-validator';
import { ARTICLES_STATUS } from 'src/constants';
import { ArticleStatusType } from 'src/types';

export class CreateArticleDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsIn(Object.values(ARTICLES_STATUS))
  status?: ArticleStatusType;

  @IsOptional()
  @IsUUID()
  authorId?: string | null;

  @IsOptional()
  @IsUUID()
  categoryId?: string | null;

  @IsOptional()
  @IsArray()
  tags?: string[];
}