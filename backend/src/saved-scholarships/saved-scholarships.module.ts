import { Module } from '@nestjs/common';
import { SavedScholarshipsController } from './saved-scholarships.controller.js';
import { SavedScholarshipsService } from './saved-scholarships.service.js';

@Module({
  controllers: [SavedScholarshipsController],
  providers: [SavedScholarshipsService]
})
export class SavedScholarshipsModule {}
