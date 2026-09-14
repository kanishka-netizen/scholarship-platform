import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { EligibilityService } from './eligibility.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { OwnershipGuard } from '../auth/ownership.guard.js';

@UseGuards(AuthGuard, OwnershipGuard)
@Controller('users/:userId')
export class EligibilityController {
  constructor(
    private readonly eligibilityService: EligibilityService,
  ) {}

  @Get('eligible-scholarships')
  async getEligibleScholarships(
    @Param('userId') userId: string,
  ) {
    return this.eligibilityService.getEligibleScholarships(userId);
  }
}