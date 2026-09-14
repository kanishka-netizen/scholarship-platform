import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ProfileDto } from './dto/profile.dto.js';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async createProfile(userId: string, data: ProfileDto) {
    return this.prisma.studentProfile.upsert({
      where: { userId },
      create: {
        userId,
        dateOfBirth: data.dateOfBirth
          ? new Date(data.dateOfBirth)
          : undefined,
        gender: data.gender,
        state: data.state,
        district: data.district,
        ruralUrban: data.ruralUrban,

        college: data.college,
        course: data.course,
        branch: data.branch,
        yearOfStudy: data.yearOfStudy,
        semester: data.semester,
        currentPercentage: data.currentPercentage,
        currentCGPA: data.currentCGPA,
        previousQualification: data.previousQualification,
        previousPercentage: data.previousPercentage,

        annualFamilyIncome: data.annualFamilyIncome,
        incomeCertificate: data.incomeCertificate,
        ews: data.ews,
        dependents: data.dependents,

        category: data.category,
        disabilityStatus: data.disabilityStatus,
        additionalInfo: data.additionalInfo,
      },
      update: {
        ...this.toProfileData(data),
      },
    });
  }

  async updateProfile(userId: string, data: ProfileDto) {
    return this.prisma.studentProfile.update({
      where: { userId },
      data: this.toProfileData(data),
    });
  }

  private toProfileData(data: ProfileDto) {
    return {
      ...(data.dateOfBirth !== undefined && {
        dateOfBirth: new Date(data.dateOfBirth),
      }),
      ...data,
      dateOfBirth: data.dateOfBirth
        ? new Date(data.dateOfBirth)
        : undefined,
    };
  }

  async getProfile(userId: string) {
    return this.prisma.studentProfile.findUnique({
      where: { userId },
    });
  }
}