import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from './config.service';

/**
 * Redis Service
 * Provides Redis operations using ioredis
 */
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
	private client: Redis;

	constructor(private configService: ConfigService) {}

	async onModuleInit() {
		const config = this.configService.redisConfig;

		this.client = new Redis({
			host: config.host,
			port: config.port,
			username: config.username,
			password: config.password,
			family: config.family,
			lazyConnect: true,
		});

		await this.client.connect();
		console.log(
			`[RedisService] Connected to Redis at ${config.host}:${config.port}`,
		);
	}

	async onModuleDestroy() {
		await this.client.quit();
		console.log('[RedisService] Disconnected from Redis');
	}

	/**
	 * Get the raw Redis client (for advanced usage)
	 */
	getClient(): Redis {
		return this.client;
	}

	/**
	 * Set a key-value pair
	 */
	async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
		if (ttlSeconds) {
			await this.client.setex(key, ttlSeconds, value);
		} else {
			await this.client.set(key, value);
		}
	}

	/**
	 * Get a value by key
	 */
	async get(key: string): Promise<string | null> {
		return await this.client.get(key);
	}

	/**
	 * Delete a key
	 */
	async del(key: string): Promise<number> {
		return await this.client.del(key);
	}

	/**
	 * Check if a key exists
	 */
	async exists(key: string): Promise<boolean> {
		const result = await this.client.exists(key);
		return result === 1;
	}

	/**
	 * Set expiration on a key
	 */
	async expire(key: string, seconds: number): Promise<boolean> {
		const result = await this.client.expire(key, seconds);
		return result === 1;
	}

	/**
	 * Get remaining TTL on a key
	 */
	async ttl(key: string): Promise<number> {
		return await this.client.ttl(key);
	}

	/**
	 * Set a JSON object (automatically stringified)
	 */
	async setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
		const jsonString = JSON.stringify(value);
		await this.set(key, jsonString, ttlSeconds);
	}

	/**
	 * Get a JSON object (automatically parsed)
	 */
	async getJson<T>(key: string): Promise<T | null> {
		const value = await this.get(key);
		if (!value) return null;

		try {
			return JSON.parse(value) as T;
		} catch {
			return null;
		}
	}

	/**
	 * Increment a counter
	 */
	async incr(key: string): Promise<number> {
		return await this.client.incr(key);
	}

	/**
	 * Decrement a counter
	 */
	async decr(key: string): Promise<number> {
		return await this.client.decr(key);
	}

	/**
	 * Get keys matching a pattern
	 */
	async keys(pattern: string): Promise<string[]> {
		return await this.client.keys(pattern);
	}

	/**
	 * Delete multiple keys matching a pattern
	 */
	async deletePattern(pattern: string): Promise<number> {
		const keys = await this.keys(pattern);
		if (keys.length === 0) return 0;

		return await this.client.del(...keys);
	}
}
