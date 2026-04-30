import { IsOptional, IsEnum, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import * as C from '../../constants';
import { PromptsSummarizeSizeType } from '../../types';

const options = [C.SHORT, C.MEDIUM, C.DETAILED];
export class SummarizeArticleDto {
  @ApiPropertyOptional({
    enum: options,
    default: C.MEDIUM,
    description: 'Controls summary length',
  })
  @IsOptional()
  @IsEnum(options)
  maxLength?: PromptsSummarizeSizeType = C.MEDIUM;

  @ApiProperty({
    description: 'Text for Summarize',
  })
  @IsString()
  @MinLength(10)
  text: string;
}
