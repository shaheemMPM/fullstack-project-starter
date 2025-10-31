import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { QueueService } from './queue/queue.service';

const bootstrap = async () => {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	// Global exception filter for consistent error responses
	app.useGlobalFilters(new HttpExceptionFilter());

	// Setup Bull Board for queue monitoring
	const queueService = app.get(QueueService);
	const serverAdapter = new ExpressAdapter();
	serverAdapter.setBasePath('/admin/queues');

	createBullBoard({
		queues: [new BullMQAdapter(queueService.getEmailQueue())],
		serverAdapter: serverAdapter,
	});

	app.use('/admin/queues', serverAdapter.getRouter());

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
