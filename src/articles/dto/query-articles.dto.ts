import { IsInt, IsOptional, IsString, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

import * as C from '../../constants';
import { ArticleSortEntities, ArticleSortType } from 'src/types';

export class QueryArticlesDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = C.FIRST_PAGE_COUNT;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = C.ITEM_COUNT_IN_PAGE;

  @IsOptional()
  @IsString()
  sortBy?: keyof ArticleSortEntities;

  @IsOptional()
  @IsIn([C.ASC, C.DESC])
  order?: ArticleSortType = C.ASC;
}
