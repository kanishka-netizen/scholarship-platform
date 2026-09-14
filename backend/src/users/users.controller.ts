import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard.js';
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getCurrentUser(@Req() request: { dbUser: { id: string } }) {
    return this.usersService.getUser(request.dbUser.id);
  }

  @Post()
  async createUser(
    @Body('email') email: string,
    @Body('name') name?: string,
  ) {
    return this.usersService.createUser(email, name);
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }
}