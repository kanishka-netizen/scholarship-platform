import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ApplicationsService } from './applications.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('ApplicationsService', () => {
  const prisma = {
    scholarship: {
      findUnique: async ({ where }: { where: { id: string } }) =>
        where.id === 'sch-1' ? { id: 'sch-1' } : null,
    },
    application: {
      create: async (args: { data: object }) => ({
        id: 'app-1',
        ...args.data,
        scholarship: { id: 'sch-1', name: 'Merit Scheme' },
      }),
      findMany: async () => [],
      findFirst: async () => null,
      update: async () => ({ id: 'app-1' }),
      delete: async () => ({ id: 'app-1' }),
    },
  };

  let service: ApplicationsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(ApplicationsService);
  });

  it('creates an application for an existing scholarship', async () => {
    const application = await service.createApplication('user-1', {
      scholarshipId: 'sch-1',
      notes: 'Need income certificate',
    });
    expect(application.id).toBe('app-1');
  });

  it('throws when the scholarship does not exist', async () => {
    await expect(
      service.createApplication('user-1', { scholarshipId: 'missing' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws when an application is missing', async () => {
    await expect(service.getApplication('user-1', 'missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
