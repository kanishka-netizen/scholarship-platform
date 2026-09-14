import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SavedScholarshipsService } from './saved-scholarships.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('SavedScholarshipsService', () => {
  const prisma = {
    scholarship: {
      findUnique: async () => ({ id: 'sch-1' }),
    },
    savedScholarship: {
      upsert: async (args: { create: object }) => ({
        id: 'saved-1',
        ...args.create,
        scholarship: { id: 'sch-1', name: 'Merit Scheme' },
      }),
      findMany: async () => [],
      findUnique: async () => null,
      update: async () => ({ id: 'saved-1', notes: 'Follow up' }),
      delete: async () => ({ id: 'saved-1' }),
    },
  };

  let service: SavedScholarshipsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SavedScholarshipsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(SavedScholarshipsService);
  });

  it('upserts a saved scholarship instead of duplicating it', async () => {
    const saved = await service.saveScholarship('user-1', 'sch-1', 'Priority');
    expect(saved.scholarship.id).toBe('sch-1');
  });

  it('throws when a saved scholarship is missing', async () => {
    await expect(
      service.getSavedScholarship('user-1', 'missing'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
