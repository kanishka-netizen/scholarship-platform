import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ProfilesService } from './profiles.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { OwnershipGuard } from '../auth/ownership.guard.js';
import { ProfileDto } from './dto/profile.dto.js';

@UseGuards(AuthGuard, OwnershipGuard)
@Controller('users/:userId/profile')
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
  ) {}

  @Post()
  async createProfile(
    @Param('userId') userId: string,
    @Body() data: ProfileDto,
  ) {
    return this.profilesService.createProfile(
      userId,
      data,
    );
  }

  @Patch()
  async updateProfile(
    @Param('userId') userId: string,
    @Body() data: ProfileDto,
  ) {
    return this.profilesService.updateProfile(userId, data);
  }

  @Get()
  async getProfile(
    @Param('userId') userId: string,
  ) {
    return this.profilesService.getProfile(userId);
  }
}