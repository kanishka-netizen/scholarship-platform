import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger / OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Scholarship Platform API')
    .setDescription('REST API for the Scholarship Discovery Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  // CORS
  const frontendOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ].filter(Boolean);

  app.enableCors({
    origin: frontendOrigins,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Instance identification header for load balancing
  app.use((_req: any, res: any, next: any) => {
    res.setHeader('X-Backend-Instance', process.env.INSTANCE_NAME || 'backend-default');
    next();
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port, '0.0.0.0');
}

bootstrap();