import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

function normalize(value?: string | null) {
  return value?.trim().toLowerCase() ?? '';
}

function isOpenConstraint(value?: string | null) {
  const text = normalize(value);
  if (!text) return true;

  return (
    text.includes('all india') ||
    text.includes('pan india') ||
    text.includes('nationwide') ||
    text.includes('all state') ||
    ['india', 'national', 'any', 'all', 'na', 'n/a'].includes(text)
  );
}

function matchesText(required?: string | null, actual?: string | null) {
  if (isOpenConstraint(required)) return true;

  const got = normalize(actual);
  if (!got) return true;

  const need = normalize(required);
  return need.includes(got) || got.includes(need);
}

@Injectable()
export class EligibilityService {
  constructor(private readonly prisma: PrismaService) {}

  async getEligibleScholarships(userId: string) {
    const profile = await this.prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return {
        userId,
        profileComplete: false,
        totalEligible: 0,
        data: [],
      };
    }

    const scholarships = await this.prisma.scholarship.findMany({
      where: { active: true },
      orderBy: { deadline: 'asc' },
    });

    const results = scholarships.map((scholarship) => {
      const reasons: string[] = [];
      const failedReasons: string[] = [];

      if (isOpenConstraint(scholarship.state)) {
        reasons.push('Available across India');
      } else if (matchesText(scholarship.state, profile.state)) {
        reasons.push(`State matches ${scholarship.state}`);
      } else {
        failedReasons.push(`Requires students from ${scholarship.state}`);
      }

      if (isOpenConstraint(scholarship.course)) {
        reasons.push('Open to all courses');
      } else if (matchesText(scholarship.course, profile.course)) {
        reasons.push(`Course matches ${scholarship.course}`);
      } else {
        failedReasons.push(`Requires course: ${scholarship.course}`);
      }

      if (isOpenConstraint(scholarship.branch)) {
        reasons.push('Open to all branches');
      } else if (matchesText(scholarship.branch, profile.branch)) {
        reasons.push(`Branch matches ${scholarship.branch}`);
      } else {
        failedReasons.push(`Requires branch: ${scholarship.branch}`);
      }

      if (scholarship.incomeLimit == null) {
        reasons.push('No income limit specified');
      } else if (profile.annualFamilyIncome == null) {
        reasons.push(
          `Confirm family income is ₹${scholarship.incomeLimit} or below`,
        );
      } else if (profile.annualFamilyIncome <= scholarship.incomeLimit) {
        reasons.push('Family income is within the limit');
      } else {
        failedReasons.push(
          `Family income must be ₹${scholarship.incomeLimit} or below`,
        );
      }

      return {
        scholarship,
        eligible: failedReasons.length === 0,
        reasons,
        failedReasons,
      };
    });

    const eligible = results.filter((result) => result.eligible);

    return {
      userId,
      profileComplete: true,
      totalEligible: eligible.length,
      data: eligible,
    };
  }
}
