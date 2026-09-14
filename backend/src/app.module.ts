import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'node:path';
import { AppController } from './app.controller.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ScholarshipsModule } from './scholarships/scholarships.module.js';
import { UsersModule } from './users/users.module.js';
import { ProfilesModule } from './profiles/profiles.module.js';
import { EligibilityModule } from './eligibility/eligibility.module.js';
import { SavedScholarshipsModule } from './saved-scholarships/saved-scholarships.module.js';
import { ApplicationsModule } from './applications/applications.module.js';
import { DocumentsModule } from './documents/documents.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        resolve(process.cwd(), '.env'),
        resolve(process.cwd(), '..', '.env'),
      ],
    }),
    PrismaModule,
    ScholarshipsModule,
    UsersModule,
    ProfilesModule,
    EligibilityModule,
    SavedScholarshipsModule,
    ApplicationsModule,
    DocumentsModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}