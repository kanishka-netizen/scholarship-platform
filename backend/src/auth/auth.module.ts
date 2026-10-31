import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthGuard } from './auth.guard.js';
import { OwnershipGuard } from './ownership.guard.js';
import { AdminGuard } from './admin.guard.js';
import { ScraperAdminGuard } from './scraper-admin.guard.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';

@Module({
  imports: [SupabaseModule, PrismaModule],
  controllers: [AuthController],
  providers: [
    AuthGuard,
    OwnershipGuard,
    AdminGuard,
    ScraperAdminGuard,
    AuthService,
  ],
  exports: [
    AuthGuard,
    OwnershipGuard,
    AdminGuard,
    ScraperAdminGuard,
    AuthService,
  ],
})
export class AuthModule {}