import {
	type ArgumentsHost,
	Catch,
	type ExceptionFilter,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';

/**
 * Error response structure
 */
export interface ErrorResponse {
	statusCode: number;
	message: string;
	error: string;
	timestamp: string;
	path: string;
	validationErrors?: Record<string, string[]>;
}

/**
 * Global exception filter that catches all HTTP exceptions
 * and formats them into a consistent response structure
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest();

		// Determine status code and error details
		const statusCode = this.getStatusCode(exception);
		const errorResponse = this.getErrorResponse(exception, statusCode);

		// Build the response
		const responseBody: ErrorResponse = {
			statusCode,
			message: errorResponse.message,
			error: errorResponse.error,
			timestamp: new Date().toISOString(),
			path: request.url,
			...(errorResponse.validationErrors && {
				validationErrors: errorResponse.validationErrors,
			}),
		};

		// Log the error (you can replace this with a proper logger later)
		this.logError(exception, request);

		// Send response
		response.status(statusCode).json(responseBody);
	}

	/**
	 * Extract status code from exception
	 */
	private getStatusCode(exception: unknown): number {
		if (exception instanceof HttpException) {
			return exception.getStatus();
		}
		return HttpStatus.INTERNAL_SERVER_ERROR;
	}

	/**
	 * Extract error details from exception
	 */
	private getErrorResponse(
		exception: unknown,
		_statusCode: number,
	): {
		message: string;
		error: string;
		validationErrors?: Record<string, string[]>;
	} {
		if (exception instanceof HttpException) {
			const response = exception.getResponse();

			// Handle validation errors from class-validator
			if (typeof response === 'object' && 'message' in response) {
				const messages = response.message;

				// If validation errors are present, format them
				if (Array.isArray(messages)) {
					return {
						message: 'Validation failed',
						error: exception.name,
						validationErrors: this.formatValidationErrors(messages),
					};
				}

				return {
					message: messages as string,
					error: exception.name,
				};
			}

			return {
				message: response as string,
				error: exception.name,
			};
		}

		// Handle unknown errors
		return {
			message: 'Internal server error',
			error: 'InternalServerError',
		};
	}

	/**
	 * Format validation errors into a more readable structure
	 */
	private formatValidationErrors(messages: string[]): Record<string, string[]> {
		// If messages are already in a structured format, return them
		// Otherwise, return a generic structure
		return { general: messages };
	}

	/**
	 * Log the error (replace with proper logger like Winston/Pino later)
	 */
	private logError(exception: unknown, request: any) {
		const statusCode = this.getStatusCode(exception);
		const message =
			exception instanceof Error ? exception.message : 'Unknown error';

		console.error(
			`[${new Date().toISOString()}] ${request.method} ${request.url} - ${statusCode} - ${message}`,
		);

		// Log stack trace for 500 errors
		if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
			console.error(exception);
		}
	}
}
