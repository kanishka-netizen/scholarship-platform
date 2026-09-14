import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class EligibilityService {
  constructor(private readonly prisma: PrismaService) {}

  async getEligibleScholarships(userId: string) {
    const profile = await this.prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new Error('Student profile not found');
    }

    const scholarships = await this.prisma.scholarship.findMany({
      where: { active: true },
      orderBy: { deadline: 'asc' },
    });

    const results = scholarships.map((scholarship) => {
      const reasons: string[] = [];
      const failedReasons: string[] = [];

      // State
      if (!scholarship.state) {
        reasons.push('Available across all states');
      } else if (
        profile.state &&
        scholarship.state.toLowerCase() === profile.state.toLowerCase()
      ) {
        reasons.push('State requirement matches');
      } else {
        failedReasons.push(
          `Requires students from ${scholarship.state}`,
        );
      }

      // Course
      if (!scholarship.course) {
        reasons.push('Available for all courses');
      } else if (
        profile.course &&
        scholarship.course
          .toLowerCase()
          .includes(profile.course.toLowerCase())
      ) {
        reasons.push('Course requirement matches');
      } else {
        failedReasons.push(
          `Requires course: ${scholarship.course}`,
        );
      }

      // Branch
      if (!scholarship.branch) {
        reasons.push('Available for all branches');
      } else if (
        profile.branch &&
        scholarship.branch
          .toLowerCase()
          .includes(profile.branch.toLowerCase())
      ) {
        reasons.push('Branch requirement matches');
      } else {
        failedReasons.push(
          `Requires branch: ${scholarship.branch}`,
        );
      }

      // Income
      if (scholarship.incomeLimit === null) {
        reasons.push('No income limit specified');
      } else if (
        profile.annualFamilyIncome !== null &&
        profile.annualFamilyIncome <= scholarship.incomeLimit
      ) {
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
      totalEligible: eligible.length,
      data: eligible,
    };
  }
}