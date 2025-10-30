import { ApiClientError } from '@repo/api-client';

/**
 * Extract a user-friendly error message from various error types
 */
export const getErrorMessage = (error: unknown): string => {
	// Handle ApiClientError from our API client
	if (error instanceof ApiClientError) {
		// Check if there are validation errors
		if (error.validationErrors) {
			const firstField = Object.keys(error.validationErrors)[0];
			const firstError = error.validationErrors[firstField]?.[0];
			if (firstError) {
				return firstError;
			}
		}
		// Return the main error message
		return error.message;
	}

	// Handle standard Error objects
	if (error instanceof Error) {
		return error.message;
	}

	// Handle string errors
	if (typeof error === 'string') {
		return error;
	}

	// Fallback for unknown error types
	return 'An unexpected error occurred';
};

/**
 * Get all validation errors as an array of messages
 */
export const getValidationErrors = (error: unknown): string[] => {
	if (error instanceof ApiClientError && error.validationErrors) {
		const messages: string[] = [];
		for (const field in error.validationErrors) {
			messages.push(...error.validationErrors[field]);
		}
		return messages;
	}
	return [];
};

/**
 * Check if an error is an authentication error (401)
 */
export const isAuthError = (error: unknown): boolean => {
	return error instanceof ApiClientError && error.statusCode === 401;
};

/**
 * Check if an error is a validation error (400 with validation errors)
 */
export const isValidationError = (error: unknown): boolean => {
	return (
		error instanceof ApiClientError &&
		error.statusCode === 400 &&
		!!error.validationErrors
	);
};
