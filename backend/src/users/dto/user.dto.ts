import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '../../generated/prisma/enums.js';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
