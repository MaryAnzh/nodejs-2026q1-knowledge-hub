import { Role } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @ApiProperty({
    enum: Role,
    description: 'New role for the user',
    example: Role.editor,
  })
  @IsEnum(Role)
  role: Role;
}
