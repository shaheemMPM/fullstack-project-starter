import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Global API prefix for all routes
  app.setGlobalPrefix('api');

  // Enable CORS in development only
  if (process.env.NODE_ENV !== 'production') {
    app.enableCors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      credentials: true,
    });
  }

  // Serve static frontend files in production
  const frontendDistPath = join(
    __dirname,
    '..',
    '..',
    '..',
    'frontend',
    'dist',
  );
  if (existsSync(frontendDistPath)) {
    app.useStaticAssets(frontendDistPath);
    app.setBaseViewsDir(frontendDistPath);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
