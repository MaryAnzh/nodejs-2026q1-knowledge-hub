import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsUUID()
  articleId: string;

  @IsOptional()
  @IsUUID()
  authorId?: string | null;
}
