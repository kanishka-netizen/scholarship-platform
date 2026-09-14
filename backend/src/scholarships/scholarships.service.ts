import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { Prisma } from '../generated/prisma/client.js';
import { ImportScholarshipRecordDto } from './dto/import-scholarships.dto.js';

interface ScholarshipQuery {
  search?: string;
  state?: string;
  course?: string;
  sort?: string;
  page: number;
  limit: number;
}

@Injectable()
export class ScholarshipsService {
  constructor(private readonly prisma: PrismaService) {}

  async getScholarships(query: ScholarshipQuery) {
    const { search, state, course, sort, page, limit } = query;

    const where = {
      active: true,
      ...(state && {
        state: {
          contains: state,
          mode: 'insensitive' as const,
        },
      }),
      ...(course && {
        course: {
          contains: course,
          mode: 'insensitive' as const,
        },
      }),
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive' as const,
            },
          },
          {
            provider: {
              contains: search,
              mode: 'insensitive' as const,
            },
          },
          {
            description: {
              contains: search,
              mode: 'insensitive' as const,
            },
          },
        ],
      }),
    };

    let orderBy: object = { deadline: 'asc' };

    if (sort === 'amount') {
      orderBy = { amount: 'desc' };
    } else if (sort === 'recent') {
      orderBy = { createdAt: 'desc' };
    }

    const skip = (page - 1) * limit;

    const [scholarships, total] = await Promise.all([
      this.prisma.scholarship.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.scholarship.count({ where }),
    ]);

    return {
      data: scholarships,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async getScholarshipById(id: string) {
  return this.prisma.scholarship.findUnique({
    where: { id },
  });
}

async createScholarship(data: {
  name: string;
  provider: string;
  description?: string;
  amount?: number;
  startDate?: string;
  deadline?: string;
  educationLevel?: string;
  course?: string;
  branch?: string;
  state?: string;
  incomeLimit?: number;
  applicationUrl?: string;
  source?: string;
}) {
  return this.prisma.scholarship.create({
    data: {
      name: data.name,
      provider: data.provider,
      description: data.description,
      amount: data.amount,
      startDate: data.startDate
        ? new Date(data.startDate)
        : undefined,
      deadline: data.deadline
        ? new Date(data.deadline)
        : undefined,
      educationLevel: data.educationLevel,
      course: data.course,
      branch: data.branch,
      state: data.state,
      incomeLimit: data.incomeLimit,
      applicationUrl: data.applicationUrl,
      source: data.source,
    },
  });
}
async updateScholarship(
  id: string,
  data: {
    name?: string;
    provider?: string;
    description?: string;
    amount?: number;
    startDate?: string;
    deadline?: string;
    educationLevel?: string;
    course?: string;
    branch?: string;
    state?: string;
    incomeLimit?: number;
    applicationUrl?: string;
    source?: string;
    verified?: boolean;
    active?: boolean;
  },
) {
  return this.prisma.scholarship.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.provider !== undefined && { provider: data.provider }),
      ...(data.description !== undefined && {
        description: data.description,
      }),
      ...(data.amount !== undefined && { amount: data.amount }),
      ...(data.startDate !== undefined && {
        startDate: new Date(data.startDate),
      }),
      ...(data.deadline !== undefined && {
        deadline: new Date(data.deadline),
      }),
      ...(data.educationLevel !== undefined && {
        educationLevel: data.educationLevel,
      }),
      ...(data.course !== undefined && { course: data.course }),
      ...(data.branch !== undefined && { branch: data.branch }),
      ...(data.state !== undefined && { state: data.state }),
      ...(data.incomeLimit !== undefined && {
        incomeLimit: data.incomeLimit,
      }),
      ...(data.applicationUrl !== undefined && {
        applicationUrl: data.applicationUrl,
      }),
      ...(data.source !== undefined && { source: data.source }),
      ...(data.verified !== undefined && {
        verified: data.verified,
      }),
      ...(data.active !== undefined && { active: data.active }),
    },
  });
}
async deleteScholarship(id: string) {
  return this.prisma.scholarship.delete({
    where: { id },
  });
}

  async importScholarships(records: ImportScholarshipRecordDto[]) {
    const uniqueRecords = this.uniqueImportRecords(records);
    const existing = await this.findImportedScholarships(uniqueRecords);
    const urlCounts = new Map<string, number>();
    for (const record of uniqueRecords) {
      if (!record.applicationUrl) continue;
      urlCounts.set(
        record.applicationUrl,
        (urlCounts.get(record.applicationUrl) ?? 0) + 1,
      );
    }
    const existingByApplicationUrl = new Map(
      existing
        .filter((scholarship) => scholarship.applicationUrl)
        .map((scholarship) => [scholarship.applicationUrl!, scholarship]),
    );
    const existingByIdentity = new Map(
      existing.map((scholarship) => [
        this.importIdentity(
          scholarship.name,
          scholarship.provider,
          scholarship.source,
        ),
        scholarship,
      ]),
    );
    const updates: Array<{ id: string; data: object }> = [];
    const inserts: Prisma.ScholarshipCreateManyInput[] = [];
    const lastVerified = new Date();

    for (const record of uniqueRecords) {
      const data = this.importData(record, lastVerified);
      const distinctApplicationUrl =
        record.applicationUrl && urlCounts.get(record.applicationUrl) === 1
          ? record.applicationUrl
          : undefined;
      const match =
        existingByIdentity.get(
          this.importIdentity(record.name, record.provider, record.source),
        ) ??
        (distinctApplicationUrl
          ? existingByApplicationUrl.get(distinctApplicationUrl)
          : undefined);

      if (match) {
        updates.push({ id: match.id, data });
      } else {
        inserts.push(data);
      }
    }

    await this.prisma.$transaction(async (transaction) => {
      if (inserts.length > 0) {
        await transaction.scholarship.createMany({
          data: inserts,
        });
      }
      await Promise.all(
        updates.map(({ id, data }) =>
          transaction.scholarship.update({ where: { id }, data }),
        ),
      );
    });

    return {
      recordsReceived: records.length,
      recordsAdded: inserts.length,
      recordsUpdated: updates.length,
    };
  }

  private async findImportedScholarships(
    records: ImportScholarshipRecordDto[],
  ) {
    const conditions = records.flatMap((record) => [
      ...(record.applicationUrl
        ? [{ applicationUrl: record.applicationUrl }]
        : []),
      {
        name: record.name,
        provider: record.provider,
        ...(record.source ? { source: record.source } : {}),
      },
    ]);

    return this.prisma.scholarship.findMany({ where: { OR: conditions } });
  }

  private uniqueImportRecords(records: ImportScholarshipRecordDto[]) {
    const unique = new Map<string, ImportScholarshipRecordDto>();
    for (const record of records) {
      const key = this.importIdentity(
        record.name,
        record.provider,
        record.source,
      );
      if (!unique.has(key)) unique.set(key, record);
    }
    return [...unique.values()];
  }

  private importIdentity(
    name: string,
    provider: string,
    source?: string | null,
  ) {
    return `${provider}\u0000${name}\u0000${source ?? ''}`;
  }

  private importData(
    record: ImportScholarshipRecordDto,
    lastVerified: Date,
  ) {
    return {
      name: record.name,
      provider: record.provider,
      description: record.description,
      amount: record.amount,
      startDate: record.startDate ? new Date(record.startDate) : null,
      deadline: record.deadline ? new Date(record.deadline) : null,
      educationLevel: record.educationLevel,
      course: record.course,
      branch: record.branch,
      state: record.state,
      incomeLimit: record.incomeLimit,
      applicationUrl: record.applicationUrl,
      source: record.source,
      verified: record.verified,
      active: record.active,
      lastVerified,
    };
  }
}