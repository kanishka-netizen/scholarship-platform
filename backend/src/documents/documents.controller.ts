import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { OwnershipGuard } from '../auth/ownership.guard.js';

@UseGuards(AuthGuard, OwnershipGuard)
@Controller('users/:userId/documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @Param('userId') userId: string,
    @UploadedFile() file: any,
    @Body('type') type: string,
    @Body('expiryDate') expiryDate?: string,
  ) {
    return this.documentsService.uploadDocument(
      userId,
      file,
      type,
      expiryDate,
    );
  }

  @Get()
  async getDocuments(
    @Param('userId') userId: string,
  ) {
    return this.documentsService.getDocuments(userId);
  }

  @Delete(':documentId')
  async deleteDocument(
    @Param('userId') userId: string,
    @Param('documentId') documentId: string,
  ) {
    return this.documentsService.deleteDocument(
      userId,
      documentId,
    );
  }
}