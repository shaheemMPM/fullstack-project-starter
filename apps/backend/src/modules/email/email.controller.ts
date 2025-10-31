import { Public } from '@modules/auth/decorators/public.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import type { SendEmailJobData } from './email.service';
import { EmailService } from './email.service';

/**
 * Email Controller
 * Endpoints for testing and interacting with email queue
 */
@Controller('email')
export class EmailController {
	constructor(private readonly emailService: EmailService) {}

	/**
	 * Test endpoint to queue an email
	 * @example
	 * POST /api/email/send
	 * {
	 *   "to": "test@example.com",
	 *   "subject": "Test Email",
	 *   "body": "This is a test email"
	 * }
	 */
	@Public()
	@Post('send')
	async sendEmail(@Body() data: SendEmailJobData) {
		return await this.emailService.sendEmail(data);
	}
}
