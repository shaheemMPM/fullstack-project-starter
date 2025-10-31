import { Injectable } from '@nestjs/common';
import type { StringValue } from 'ms';

/**
 * Configuration Service
 * Centralized service for accessing environment variables
 */
@Injectable()
export class ConfigService {
	constructor() {
		// Replace \\n with \n to support multiline strings in env vars
		for (const envName of Object.keys(process.env)) {
			if (process.env[envName]) {
				process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
			}
		}
	}

	/**
	 * Check if running in development mode
	 */
	get isDevelopment(): boolean {
		return this.nodeEnv === 'development';
	}

	/**
	 * Check if running in production mode
	 */
	get isProduction(): boolean {
		return this.nodeEnv === 'production';
	}

	/**
	 * Get environment variable as string
	 */
	public get(key: string): string {
		return process.env[key] || '';
	}

	/**
	 * Get environment variable as number
	 */
	public getNumber(key: string): number {
		return Number(this.get(key));
	}

	/**
	 * Get current NODE_ENV
	 */
	get nodeEnv(): string {
		return this.get('NODE_ENV') || 'development';
	}

	/**
	 * Get Redis configuration from REDIS_URL
	 * @example REDIS_URL=redis://username:password@localhost:6379
	 */
	get redisConfig() {
		const redisUrl = new URL(this.get('REDIS_URL') || 'redis://localhost:6379');

		return {
			username: redisUrl.username || undefined,
			password: redisUrl.password || undefined,
			port: Number(redisUrl.port) || 6379,
			host: redisUrl.hostname,
			family: Number(redisUrl.searchParams.get('family')) || 0,
		};
	}

	/**
	 * Get database URL
	 */
	get databaseUrl(): string {
		return this.get('DATABASE_URL');
	}

	/**
	 * Get JWT configuration
	 */
	get jwtSecret(): string {
		return this.get('JWT_SECRET') || 'your-secret-key-change-this';
	}

	get jwtExpiresIn(): StringValue | number {
		const value = this.get('JWT_EXPIRES_IN') || '7d';
		// Check if it's a number (in seconds)
		const num = Number(value);
		return Number.isNaN(num) ? (value as StringValue) : num;
	}

	/**
	 * Get CORS origin
	 */
	get corsOrigin(): string {
		return this.get('CORS_ORIGIN') || 'http://localhost:5173';
	}

	/**
	 * Get server port
	 */
	get port(): number {
		return this.getNumber('PORT') || 3000;
	}
}
