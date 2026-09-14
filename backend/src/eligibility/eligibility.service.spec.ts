import { Test, TestingModule } from '@nestjs/testing';
import { EligibilityService } from './eligibility.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('EligibilityService', () => {
  let service: EligibilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EligibilityService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<EligibilityService>(EligibilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
