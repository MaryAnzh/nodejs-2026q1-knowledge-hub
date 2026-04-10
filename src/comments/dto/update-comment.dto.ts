import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto {
    @ApiPropertyOptional({ example: 'Updated comment text' })
    @IsOptional()
    @IsString()
    content?: string;
}