import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TranslateArticleDto {
    @ApiProperty({
        description: 'Target language for translation',
        example: 'Spanish',
    })
    @IsString()
    targetLanguage: string;

    @ApiPropertyOptional({
        description: 'Source language (optional, auto-detected if omitted)',
        example: 'English',
    })
    @IsOptional()
    @IsString()
    sourceLanguage?: string;
}