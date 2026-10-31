import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { SetupMfaDto, VerifyMfaDto } from './dto/mfa.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('mfa/setup')
  async setupMfa(@Body() dto: SetupMfaDto) {
    return this.authService.setupMfa(dto.userId);
  }

  @Post('mfa/verify')
  async verifyAndEnableMfa(@Body() dto: VerifyMfaDto) {
    return this.authService.verifyAndEnableMfa(dto.userId, dto.token);
  }

  @Post('mfa/login')
  async verifyMfaLogin(@Body() dto: VerifyMfaDto) {
    return this.authService.verifyMfaLogin(dto.userId, dto.token);
  }
}
