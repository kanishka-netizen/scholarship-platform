import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ScraperAdminGuard } from '../auth/scraper-admin.guard.js';
import { ImportScholarshipsDto } from './dto/import-scholarships.dto.js';
import { ScholarshipsService } from './scholarships.service.js';

@Controller('admin/scholarships')
@UseGuards(ScraperAdminGuard)
export class AdminScholarshipsController {
  constructor(private readonly scholarshipsService: ScholarshipsService) {}

  @Post('import')
  importScholarships(@Body() data: ImportScholarshipsDto) {
    return this.scholarshipsService.importScholarships(data.records);
  }
}