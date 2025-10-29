import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Global API prefix for all routes
  app.setGlobalPrefix('api');

  // Enable CORS for development
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

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

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
