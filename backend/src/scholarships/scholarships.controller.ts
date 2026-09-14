import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ScholarshipsService } from './scholarships.service.js';
import { CreateScholarshipDto } from './dto/create-scholarship.dto.js';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { AdminGuard } from '../auth/admin.guard.js';

@Controller('scholarships')
export class ScholarshipsController {
  constructor(
    private readonly scholarshipsService: ScholarshipsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  async createScholarship(@Body() data: CreateScholarshipDto) {
    return this.scholarshipsService.createScholarship(data);
  }

  @Get()
  async getScholarships(
    @Query('search') search?: string,
    @Query('state') state?: string,
    @Query('course') course?: string,
    @Query('sort') sort?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.scholarshipsService.getScholarships({
      search,
      state,
      course,
      sort,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });
  }

  @Get(':id')
  async getScholarshipById(@Param('id') id: string) {
    return this.scholarshipsService.getScholarshipById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, AdminGuard)
  async updateScholarship(
    @Param('id') id: string,
    @Body() data: UpdateScholarshipDto,
  ) {
    return this.scholarshipsService.updateScholarship(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, AdminGuard)
  async deleteScholarship(@Param('id') id: string) {
    return this.scholarshipsService.deleteScholarship(id);
  }
}