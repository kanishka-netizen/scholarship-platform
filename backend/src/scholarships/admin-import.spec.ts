import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import {
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ScraperAdminGuard } from '../auth/scraper-admin.guard.js';
import {
  ImportScholarshipsDto,
  ImportScholarshipRecordDto,
} from './dto/import-scholarships.dto.js';
import { ScholarshipsService } from './scholarships.service.js';

const validRecord = {
  name: 'Imported Scheme',
  provider: 'Official Provider',
  description: 'Official eligibility details',
  amount: 50000,
  deadline: '2026-10-31',
  state: 'Tamil Nadu',
  source: 'https://official.example/scheme',
  verified: true,
  active: true,
};

function requestContext(request: object): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as ExecutionContext;
}

describe('scholarship import', () => {
  it('rejects malformed imported records', () => {
    const dto = plainToInstance(ImportScholarshipsDto, {
      records: [{ ...validRecord, name: '', amount: -1 }],
    });
    expect(validateSync(dto).length).toBeGreaterThan(0);
  });

  it('allows the configured scraper token', () => {
    const guard = new ScraperAdminGuard({
      get: () => 'scraper-secret',
    } as never);

    expect(
      guard.canActivate(
        requestContext({
          headers: { authorization: 'Bearer scraper-secret' },
        }),
      ),
    ).toBe(true);
  });

  it.each([
    {},
    { authorization: 'Bearer wrong-secret' },
    { authorization: 'Basic scraper-secret' },
    { authorization: 'Bearer' },
  ])('rejects malformed or invalid scraper authorization: %j', (headers) => {
    const guard = new ScraperAdminGuard({
      get: () => 'scraper-secret',
    } as never);

    expect(() =>
      guard.canActivate(requestContext({ headers })),
    ).toThrow(UnauthorizedException);
  });

  it('inserts and updates matching records in a 31-record batch without duplicates', async () => {
    const records = new Map<string, { id: string }>();
    let findManyCalls = 0;
    const prisma = {
      scholarship: {
        findMany: async () => {
          findManyCalls += 1;
          return [...records.entries()].map(([key, value]) => ({
            ...value,
            name: key.split(':')[1],
            provider: key.split(':')[0],
            applicationUrl: key.startsWith('https://') ? key : null,
            source: 'https://official.example/scheme',
          }));
        },
        createMany: async ({ data }: { data: Array<typeof validRecord> }) => {
          for (const item of data) {
            records.set(item.applicationUrl ?? `${item.provider}:${item.name}:${item.source}`, { id: `id-${records.size}` });
          }
          return { count: data.length };
        },
        update: async ({ where }: { where: { id: string } }) => ({ id: where.id }),
      },
    };
    const service = new ScholarshipsService(prisma as never);
    const batch = Array.from({ length: 31 }, (_, index) => ({
      ...validRecord,
      name: `Imported Scheme ${index}`,
      applicationUrl: `https://official.example/scheme/${index}`,
    })) as ImportScholarshipRecordDto[];
    const first = await service.importScholarships(batch);
    const second = await service.importScholarships(batch);

    expect(first).toMatchObject({ recordsReceived: 31, recordsAdded: 31, recordsUpdated: 0 });
    expect(second).toMatchObject({ recordsReceived: 31, recordsAdded: 0, recordsUpdated: 31 });
    expect(findManyCalls).toBe(2);
  });

  it('keeps listings that share one portal application URL as separate scholarships', async () => {
    const records = new Map<string, { id: string; name: string; provider: string; applicationUrl: string; source: string }>();
    const prisma = {
      scholarship: {
        findMany: async () => [...records.values()],
        createMany: async ({ data }: { data: Array<{ name: string; provider: string; applicationUrl?: string; source?: string }> }) => {
          for (const item of data) {
            records.set(`${item.provider}:${item.name}:${item.source}`, {
              id: `id-${records.size}`,
              name: item.name,
              provider: item.provider,
              applicationUrl: item.applicationUrl!,
              source: item.source!,
            });
          }
          return { count: data.length };
        },
        update: async ({ where }: { where: { id: string } }) => ({ id: where.id }),
      },
    };
    const service = new ScholarshipsService(prisma as never);
    const sharedPortal = 'https://scholarships.gov.in/All-Scholarships.action';
    const batch = Array.from({ length: 8 }, (_, index) => ({
      ...validRecord,
      name: `National Scheme ${index}`,
      applicationUrl: sharedPortal,
    })) as ImportScholarshipRecordDto[];

    const first = await service.importScholarships(batch);
    const second = await service.importScholarships(batch);

    expect(first).toMatchObject({
      recordsReceived: 8,
      recordsAdded: 8,
      recordsUpdated: 0,
    });
    expect(second).toMatchObject({
      recordsReceived: 8,
      recordsAdded: 0,
      recordsUpdated: 8,
    });
    expect(records.size).toBe(8);
  });
});
