import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApplicationsService } from './applications.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { OwnershipGuard } from '../auth/ownership.guard.js';
import {
  CreateApplicationDto,
  UpdateApplicationDto,
} from './dto/application.dto.js';

@UseGuards(AuthGuard,OwnershipGuard)
@Controller('users/:userId/applications')
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
  ) {}

  @Post()
  async createApplication(
    @Param('userId') userId: string,
    @Body() data: CreateApplicationDto,
  ) {
    return this.applicationsService.createApplication(
      userId,
      data.scholarshipId,
    );
  }

  @Get()
  async getApplications(
    @Param('userId') userId: string,
  ) {
    return this.applicationsService.getApplications(userId);
  }

  @Patch(':applicationId')
  async updateApplication(
    @Param('userId') userId: string,
    @Param('applicationId') applicationId: string,
    @Body() data: UpdateApplicationDto,
  ) {
    return this.applicationsService.updateApplication(
      userId,
      applicationId,
      data,
    );
  }

  @Delete(':applicationId')
  async deleteApplication(
    @Param('userId') userId: string,
    @Param('applicationId') applicationId: string,
  ) {
    return this.applicationsService.deleteApplication(
      userId,
      applicationId,
    );
  }
}