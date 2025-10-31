import { Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import type { SendEmailJobData } from '../queue.service';

/**
 * Email Processor
 * Processes email jobs from the queue
 */
@Processor('email')
export class EmailProcessor extends WorkerHost {
	async process(job: Job<SendEmailJobData>): Promise<void> {
		const { to, subject, body: _body } = job.data;

		// Log job processing
		console.log(`[EmailProcessor] Processing job ${job.id}`);
		console.log(`[EmailProcessor] Sending email to: ${to}`);
		console.log(`[EmailProcessor] Subject: ${subject}`);

		// Simulate email sending (replace with actual email service later)
		// Example: await this.emailService.send({ to, subject, body });
		await this.simulateEmailSending();

		console.log(`[EmailProcessor] Email sent successfully to: ${to}`);
	}

	/**
	 * Simulate email sending delay
	 * Replace this with actual email service (Nodemailer, SendGrid, etc.)
	 */
	private async simulateEmailSending(): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(resolve, 2000); // Simulate 2 second delay
		});
	}
}
