import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ProfileDto {
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  ruralUrban?: string;

  @IsOptional()
  @IsString()
  college?: string;

  @IsOptional()
  @IsString()
  course?: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  yearOfStudy?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  semester?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  currentPercentage?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  currentCGPA?: number;

  @IsOptional()
  @IsString()
  previousQualification?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  previousPercentage?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  annualFamilyIncome?: number;

  @IsOptional()
  @IsBoolean()
  incomeCertificate?: boolean;

  @IsOptional()
  @IsBoolean()
  ews?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  dependents?: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  disabilityStatus?: string;

  @IsOptional()
  @IsString()
  additionalInfo?: string;
}