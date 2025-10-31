/**
 * Queue Names
 * Centralized queue name constants to avoid typos
 */
export const QUEUE_NAMES = {
	EMAIL: 'email',
} as const;

/**
 * Job Names for Email Queue
 */
export const EMAIL_JOBS = {
	SEND_EMAIL: 'send-email',
} as const;

/**
 * Type-safe queue name type
 */
export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

/**
 * Type-safe email job name type
 */
export type EmailJobName = (typeof EMAIL_JOBS)[keyof typeof EMAIL_JOBS];
