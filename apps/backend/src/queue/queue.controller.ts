import { Public } from '@modules/auth/decorators/public.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import type { SendEmailJobData } from './queue.service';
import { QueueService } from './queue.service';

/**
 * Queue Controller
 * Endpoints for testing and interacting with queues
 */
@Controller('queue')
export class QueueController {
	constructor(private readonly queueService: QueueService) {}

	/**
	 * Test endpoint to queue an email
	 * @example
	 * POST /api/queue/test-email
	 * {
	 *   "to": "test@example.com",
	 *   "subject": "Test Email",
	 *   "body": "This is a test email"
	 * }
	 */
	@Public()
	@Post('test-email')
	async testEmail(@Body() data: SendEmailJobData) {
		return await this.queueService.sendEmail(data);
	}
}
