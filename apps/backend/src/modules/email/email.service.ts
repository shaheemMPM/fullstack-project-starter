import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import type { Queue } from 'bullmq';
import { EMAIL_JOBS, QUEUE_NAMES } from '../../constants';

export interface SendEmailJobData {
	to: string;
	subject: string;
	body: string;
}

/**
 * Email Service
 * Handles adding email jobs to the queue
 */
@Injectable()
export class EmailService {
	constructor(@InjectQueue(QUEUE_NAMES.EMAIL) private emailQueue: Queue) {}

	/**
	 * Add an email to the queue to be sent
	 * @example
	 * await emailService.sendEmail({
	 *   to: 'user@example.com',
	 *   subject: 'Welcome!',
	 *   body: 'Thanks for signing up'
	 * });
	 */
	async sendEmail(data: SendEmailJobData) {
		const job = await this.emailQueue.add(EMAIL_JOBS.SEND_EMAIL, data, {
			attempts: 3, // Retry up to 3 times
			backoff: {
				type: 'exponential', // Wait longer between each retry
				delay: 1000, // Start with 1 second
			},
		});

		return {
			jobId: job.id,
			message: 'Email queued successfully',
		};
	}

	/**
	 * Get the email queue for monitoring (used by Bull Board)
	 */
	getEmailQueue(): Queue {
		return this.emailQueue;
	}
}
