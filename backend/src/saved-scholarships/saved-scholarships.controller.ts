import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SavedScholarshipsService } from './saved-scholarships.service.js';
import { OwnershipGuard } from '../auth/ownership.guard.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { UpdateSavedScholarshipDto } from './dto/saved-scholarship.dto.js';

@UseGuards(AuthGuard, OwnershipGuard)
@Controller('users/:userId/saved')
export class SavedScholarshipsController {
  constructor(
    private readonly savedScholarshipsService: SavedScholarshipsService,
  ) {}

  @Post(':scholarshipId')
  async saveScholarship(
    @Param('userId') userId: string,
    @Param('scholarshipId') scholarshipId: string,
    @Body() data: UpdateSavedScholarshipDto = {},
  ) {
    return this.savedScholarshipsService.saveScholarship(
      userId,
      scholarshipId,
      data?.notes,
    );
  }

  @Get()
  async getSavedScholarships(@Param('userId') userId: string) {
    return this.savedScholarshipsService.getSavedScholarships(userId);
  }

  @Get(':scholarshipId')
  async getSavedScholarship(
    @Param('userId') userId: string,
    @Param('scholarshipId') scholarshipId: string,
  ) {
    return this.savedScholarshipsService.getSavedScholarship(
      userId,
      scholarshipId,
    );
  }

  @Patch(':scholarshipId')
  async updateSavedScholarship(
    @Param('userId') userId: string,
    @Param('scholarshipId') scholarshipId: string,
    @Body() data: UpdateSavedScholarshipDto,
  ) {
    return this.savedScholarshipsService.updateSavedScholarship(
      userId,
      scholarshipId,
      data.notes,
    );
  }

  @Delete(':scholarshipId')
  async removeSavedScholarship(
    @Param('userId') userId: string,
    @Param('scholarshipId') scholarshipId: string,
  ) {
    return this.savedScholarshipsService.removeSavedScholarship(
      userId,
      scholarshipId,
    );
  }
}
