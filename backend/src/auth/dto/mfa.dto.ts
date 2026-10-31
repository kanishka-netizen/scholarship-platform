import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class SetupMfaDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;
}

export class VerifyMfaDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @Length(6, 6)
  token!: string;
}
