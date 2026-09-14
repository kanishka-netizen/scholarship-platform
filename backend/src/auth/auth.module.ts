import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module.js';
import { AuthGuard } from './auth.guard.js';
import { OwnershipGuard } from './ownership.guard.js';
import { AdminGuard } from './admin.guard.js';
import { ScraperAdminGuard } from './scraper-admin.guard.js';

@Module({
  imports: [SupabaseModule],
  providers: [
    AuthGuard,
    OwnershipGuard,
    AdminGuard,
    ScraperAdminGuard,
  ],
  exports: [
    AuthGuard,
    OwnershipGuard,
    AdminGuard,
    ScraperAdminGuard,
  ],
})
export class AuthModule {}