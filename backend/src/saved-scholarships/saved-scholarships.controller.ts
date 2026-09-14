import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards
} from '@nestjs/common';
import { SavedScholarshipsService } from './saved-scholarships.service.js';
import { OwnershipGuard } from '../auth/ownership.guard.js';
import { AuthGuard } from '../auth/auth.guard.js';
@UseGuards(AuthGuard,OwnershipGuard)
@Controller('users/:userId/saved')
export class SavedScholarshipsController {
  constructor(
    private readonly savedScholarshipsService: SavedScholarshipsService,
  ) {}

  @Post(':scholarshipId')
  async saveScholarship(
    @Param('userId') userId: string,
    @Param('scholarshipId') scholarshipId: string,
  ) {
    return this.savedScholarshipsService.saveScholarship(
      userId,
      scholarshipId,
    );
  }

  @Get()
  async getSavedScholarships(
    @Param('userId') userId: string,
  ) {
    return this.savedScholarshipsService.getSavedScholarships(userId);
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