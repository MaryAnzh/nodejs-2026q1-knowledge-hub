import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

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
}