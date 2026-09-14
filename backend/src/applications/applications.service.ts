import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  CreateApplicationDto,
  UpdateApplicationDto,
} from './dto/application.dto.js';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createApplication(userId: string, data: CreateApplicationDto) {
    const scholarship = await this.prisma.scholarship.findUnique({
      where: { id: data.scholarshipId },
      select: { id: true },
    });

    if (!scholarship) {
      throw new NotFoundException('Scholarship not found');
    }

    try {
      return await this.prisma.application.create({
        data: {
          userId,
          scholarshipId: data.scholarshipId,
          ...(data.status && { status: data.status }),
          ...(data.notes !== undefined && { notes: data.notes }),
        },
        include: {
          scholarship: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'An application for this scholarship already exists',
        );
      }
      throw error;
    }
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

  async getApplication(userId: string, applicationId: string) {
    const application = await this.prisma.application.findFirst({
      where: {
        id: applicationId,
        userId,
      },
      include: {
        scholarship: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async updateApplication(
    userId: string,
    applicationId: string,
    data: UpdateApplicationDto,
  ) {
    await this.getApplication(userId, applicationId);

    return this.prisma.application.update({
      where: {
        id: applicationId,
      },
      data: {
        ...(data.status !== undefined && {
          status: data.status,
        }),
        ...(data.referenceNo !== undefined && {
          referenceNo: data.referenceNo,
        }),
        ...(data.submissionDate !== undefined && {
          submissionDate: data.submissionDate
            ? new Date(data.submissionDate)
            : null,
        }),
        ...(data.notes !== undefined && {
          notes: data.notes,
        }),
      },
      include: {
        scholarship: true,
      },
    });
  }

  async deleteApplication(userId: string, applicationId: string) {
    await this.getApplication(userId, applicationId);

    return this.prisma.application.delete({
      where: {
        id: applicationId,
      },
    });
  }
}
