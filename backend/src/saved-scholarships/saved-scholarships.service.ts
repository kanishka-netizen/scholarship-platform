import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SavedScholarshipsService {
  constructor(private readonly prisma: PrismaService) {}

  async saveScholarship(
    userId: string,
    scholarshipId: string,
    notes?: string,
  ) {
    await this.ensureScholarship(scholarshipId);

    try {
      return await this.prisma.savedScholarship.upsert({
        where: {
          userId_scholarshipId: {
            userId,
            scholarshipId,
          },
        },
        create: {
          userId,
          scholarshipId,
          notes,
        },
        update: notes !== undefined ? { notes } : {},
        include: {
          scholarship: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new NotFoundException('Scholarship not found');
      }
      throw error;
    }
  }

  async getSavedScholarships(userId: string) {
    return this.prisma.savedScholarship.findMany({
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

  async getSavedScholarship(userId: string, scholarshipId: string) {
    const saved = await this.prisma.savedScholarship.findUnique({
      where: {
        userId_scholarshipId: {
          userId,
          scholarshipId,
        },
      },
      include: {
        scholarship: true,
      },
    });

    if (!saved) {
      throw new NotFoundException('Saved scholarship not found');
    }

    return saved;
  }

  async updateSavedScholarship(
    userId: string,
    scholarshipId: string,
    notes?: string,
  ) {
    await this.getSavedScholarship(userId, scholarshipId);

    return this.prisma.savedScholarship.update({
      where: {
        userId_scholarshipId: {
          userId,
          scholarshipId,
        },
      },
      data: {
        notes: notes ?? null,
      },
      include: {
        scholarship: true,
      },
    });
  }

  async removeSavedScholarship(userId: string, scholarshipId: string) {
    await this.getSavedScholarship(userId, scholarshipId);

    return this.prisma.savedScholarship.delete({
      where: {
        userId_scholarshipId: {
          userId,
          scholarshipId,
        },
      },
    });
  }

  private async ensureScholarship(scholarshipId: string) {
    const scholarship = await this.prisma.scholarship.findUnique({
      where: { id: scholarshipId },
      select: { id: true },
    });

    if (!scholarship) {
      throw new NotFoundException('Scholarship not found');
    }
  }
}
