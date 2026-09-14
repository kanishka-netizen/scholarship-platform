import { Test, TestingModule } from '@nestjs/testing';
import { SavedScholarshipsService } from './saved-scholarships.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('SavedScholarshipsService', () => {
  let service: SavedScholarshipsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SavedScholarshipsService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<SavedScholarshipsService>(SavedScholarshipsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
