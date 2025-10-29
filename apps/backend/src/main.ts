import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

const bootstrap = async () => {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	// Global validation pipe
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

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
};

bootstrap().catch((err) => {
	console.error('Failed to start application:', err);
	process.exit(1);
});
