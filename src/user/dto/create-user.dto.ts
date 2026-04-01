import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

import * as C from '../../constants'
import { UserRoleType } from "src/types";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    login: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(50)
    password: string;

    @IsEnum(Object.keys(C.USER_ROLES))
    role: UserRoleType
}