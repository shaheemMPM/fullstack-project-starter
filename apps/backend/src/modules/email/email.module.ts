import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QUEUE_NAMES } from '../../constants';
import { EmailController } from './email.controller';
import { EmailProcessor } from './email.processor';
import { EmailService } from './email.service';

/**
 * Email Module
 * Handles email sending via background jobs
 */
@Module({
	imports: [
		BullModule.registerQueue({
			name: QUEUE_NAMES.EMAIL,
		}),
	],
	controllers: [EmailController],
	providers: [EmailService, EmailProcessor],
	exports: [EmailService],
})
export class EmailModule {}
