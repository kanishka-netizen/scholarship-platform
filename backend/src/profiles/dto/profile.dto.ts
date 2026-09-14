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
  @IsInt()
  yearOfStudy?: number;

  @IsOptional()
  @IsInt()
  semester?: number;

  @IsOptional()
  @IsNumber()
  currentPercentage?: number;

  @IsOptional()
  @IsNumber()
  currentCGPA?: number;

  @IsOptional()
  @IsString()
  previousQualification?: string;

  @IsOptional()
  @IsNumber()
  previousPercentage?: number;

  @IsOptional()
  @IsNumber()
  annualFamilyIncome?: number;

  @IsOptional()
  @IsBoolean()
  incomeCertificate?: boolean;

  @IsOptional()
  @IsBoolean()
  ews?: boolean;

  @IsOptional()
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