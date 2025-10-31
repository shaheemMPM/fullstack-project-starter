import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import type { Queue } from 'bullmq';

export interface SendEmailJobData {
	to: string;
	subject: string;
	body: string;
}

/**
 * Queue Service
 * Handles adding jobs to queues
 */
@Injectable()
export class QueueService {
	constructor(@InjectQueue('email') private emailQueue: Queue) {}

	/**
	 * Add an email to the queue to be sent
	 * @example
	 * await queueService.sendEmail({
	 *   to: 'user@example.com',
	 *   subject: 'Welcome!',
	 *   body: 'Thanks for signing up'
	 * });
	 */
	async sendEmail(data: SendEmailJobData) {
		const job = await this.emailQueue.add('send-email', data, {
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
	 * Get the email queue for monitoring
	 */
	getEmailQueue(): Queue {
		return this.emailQueue;
	}
}
