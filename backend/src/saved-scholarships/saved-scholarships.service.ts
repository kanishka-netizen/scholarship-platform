import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SavedScholarshipsService {
  constructor(private readonly prisma: PrismaService) {}

  async saveScholarship(userId: string, scholarshipId: string) {
    return this.prisma.savedScholarship.create({
      data: {
        userId,
        scholarshipId,
      },
      include: {
        scholarship: true,
      },
    });
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

  async removeSavedScholarship(
    userId: string,
    scholarshipId: string,
  ) {
    return this.prisma.savedScholarship.delete({
      where: {
        userId_scholarshipId: {
          userId,
          scholarshipId,
        },
      },
    });
  }
}