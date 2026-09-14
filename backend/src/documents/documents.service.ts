import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SupabaseService } from '../supabase/supabase.service.js';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabase: SupabaseService,
  ) {}

  async uploadDocument(
    userId: string,
    file: any,
    type: string,
    expiryDate?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Only PDF, JPG, and PNG files are allowed',
      );
    }

    const filePath = `${userId}/${Date.now()}-${file.originalname}`;

    const { error } = await this.supabase
      .getClient()
      .storage
      .from('student-documents')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new BadRequestException(
        `File upload failed: ${error.message}`,
      );
    }

    return this.prisma.studentDocument.create({
      data: {
        userId,
        name: file.originalname,
        type,
        url: filePath,
        expiryDate: expiryDate
          ? new Date(expiryDate)
          : undefined,
      },
    });
  }

  async getDocuments(userId: string) {
    return this.prisma.studentDocument.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteDocument(
    userId: string,
    documentId: string,
  ) {
    const document = await this.prisma.studentDocument.findFirst({
      where: {
        id: documentId,
        userId,
      },
    });

    if (!document) {
      return { message: 'Document not found' };
    }

    const { error } = await this.supabase
      .getClient()
      .storage
      .from('student-documents')
      .remove([document.url]);

    if (error) {
      throw new BadRequestException(
        `File deletion failed: ${error.message}`,
      );
    }

    await this.prisma.studentDocument.delete({
      where: { id: documentId },
    });

    return { message: 'Document deleted successfully' };
  }
}