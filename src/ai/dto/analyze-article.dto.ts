import { IsOptional, IsEnum, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import * as C from '../../constants';
import { AnalyzePromptTaskType } from '../../types';

const options = [C.REVIEW, C.BUGS, C.OPTIMIZE, C.EXPLAIN];
export class AnalyzeArticleDto {
  @ApiPropertyOptional({
    enum: options,
    default: C.REVIEW,
    description: 'Type of analysis to perform',
  })
  @IsOptional()
  @IsEnum(options)
  task?: AnalyzePromptTaskType = C.REVIEW;

  @ApiProperty({
    description: 'Text for Summarize',
  })
  @IsString()
  @MinLength(10)
  text: string;
}
