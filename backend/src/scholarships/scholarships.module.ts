import { Module } from '@nestjs/common';
import { ScholarshipsController } from './scholarships.controller.js';
import { ScholarshipsService } from './scholarships.service.js';
import { AdminScholarshipsController } from './admin-scholarships.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [ScholarshipsController, AdminScholarshipsController],
  providers: [ScholarshipsService]
})
export class ScholarshipsModule {}
