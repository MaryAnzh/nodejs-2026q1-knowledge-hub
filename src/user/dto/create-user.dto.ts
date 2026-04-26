import { IsIn, IsOptional, IsString } from 'class-validator';
import { USER_ROLES } from 'src/constants';
import { UserRoleType } from 'src/types';

export class CreateUserDto {
  @IsString()
  login: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsIn(Object.values(USER_ROLES))
  role?: UserRoleType;
}
