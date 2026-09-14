import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateApplicationDto } from './dto/application.dto.js';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createApplication(
    userId: string,
    scholarshipId: string,
  ) {
    return this.prisma.application.create({
      data: {
        userId,
        scholarshipId,
      },
      include: {
        scholarship: true,
      },
    });
  }

  async getApplications(userId: string) {
    return this.prisma.application.findMany({
      where: {
        userId,
      },
      include: {
        scholarship: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

async updateApplication(
  userId: string,
  applicationId: string,
  data: UpdateApplicationDto,
) {
  return this.prisma.application.update({
    where: {
      id: applicationId,
      userId,
    },
    data: {
      ...(data.status && {
        status: data.status,
      }),
      ...(data.referenceNo && {
        referenceNo: data.referenceNo,
      }),
      ...(data.submissionDate && {
        submissionDate: new Date(data.submissionDate),
      }),
      ...(data.notes && {
        notes: data.notes,
      }),
    },
    include: {
      scholarship: true,
    },
  });
}

  async deleteApplication(
    userId: string,
    applicationId: string,
  ) {
    return this.prisma.application.deleteMany({
      where: {
        id: applicationId,
        userId,
      },
    });
  }
}