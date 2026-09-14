import { Test } from '@nestjs/testing';
import { EligibilityService } from './eligibility.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('EligibilityService', () => {
  const scholarships = [
    {
      id: 'national',
      name: 'National Merit',
      state: 'All India',
      course: null,
      branch: null,
      incomeLimit: null,
      deadline: new Date('2026-10-31'),
    },
    {
      id: 'maharashtra',
      name: 'Maharashtra Scheme',
      state: 'Maharashtra',
      course: 'Engineering',
      branch: null,
      incomeLimit: 250000,
      deadline: new Date('2026-11-30'),
    },
  ];

  function serviceWith(profile: object | null) {
    return Test.createTestingModule({
      providers: [
        EligibilityService,
        {
          provide: PrismaService,
          useValue: {
            studentProfile: {
              findUnique: async () => profile,
            },
            scholarship: {
              findMany: async () => scholarships,
            },
          },
        },
      ],
    })
      .compile()
      .then((module) => module.get(EligibilityService));
  }

  it('returns an empty list when the student has no profile', async () => {
    const service = await serviceWith(null);
    const result = await service.getEligibleScholarships('user-1');

    expect(result.profileComplete).toBe(false);
    expect(result.data).toEqual([]);
  });

  it('treats All India listings as eligible for any state', async () => {
    const service = await serviceWith({
      state: 'Tamil Nadu',
      course: 'Engineering',
      branch: 'CSE',
      annualFamilyIncome: 200000,
    });
    const result = await service.getEligibleScholarships('user-1');

    expect(result.profileComplete).toBe(true);
    expect(result.data.map((item) => item.scholarship.id)).toEqual([
      'national',
    ]);
  });

  it('excludes listings that fail a concrete requirement', async () => {
    const service = await serviceWith({
      state: 'Tamil Nadu',
      course: 'Arts',
      branch: null,
      annualFamilyIncome: 400000,
    });
    const result = await service.getEligibleScholarships('user-1');

    expect(result.data.map((item) => item.scholarship.id)).toEqual(['national']);
  });
});
