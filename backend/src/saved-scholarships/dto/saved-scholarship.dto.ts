import { IsOptional, IsString } from 'class-validator';

export class UpdateSavedScholarshipDto {
  @IsOptional()
  @IsString()
  notes?: string;
}
