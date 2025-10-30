import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Custom exception for business logic errors
 * Use this when you want to throw domain-specific errors with custom messages
 *
 * @example
 * throw new BusinessException('User has insufficient balance to complete this transaction');
 */
export class BusinessException extends HttpException {
	constructor(message: string, statusCode = HttpStatus.BAD_REQUEST) {
		super(message, statusCode);
	}
}
