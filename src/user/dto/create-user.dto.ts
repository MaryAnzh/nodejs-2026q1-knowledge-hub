import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

import * as C from '../../constants'
import { UserRoleType } from "src/types";

export class CreateUserDto {
    @IsString()
    login: string;

    @IsString()
    password: string;
}