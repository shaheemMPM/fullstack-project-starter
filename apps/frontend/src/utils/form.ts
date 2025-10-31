/**
 * Form utility functions for TanStack Form + Zod validation
 */

/**
 * Extracts the error message from TanStack Form validation errors.
 * When using Zod with TanStack Form, errors are returned as StandardSchemaV1Issue objects,
 * not plain strings. This helper safely extracts the message.
 *
 * @param errors - Array of validation errors from field.state.meta.errors
 * @returns The first error message as a string, or null if no errors
 *
 * @example
 * ```tsx
 * <form.Field
 *   name="email"
 *   children={(field) => (
 *     <div>
 *       <input value={field.state.value} onChange={...} />
 *       {getErrorMessage(field.state.meta.errors) && (
 *         <p className="error">{getErrorMessage(field.state.meta.errors)}</p>
 *       )}
 *     </div>
 *   )}
 * />
 * ```
 */
export const getErrorMessage = (errors: unknown[]): string | null => {
	if (errors.length === 0) return null;

	const error = errors[0];

	// Handle string errors (custom validators)
	if (typeof error === 'string') return error;

	// Handle StandardSchemaV1Issue objects (Zod/Valibot/ArkType)
	if (error && typeof error === 'object' && 'message' in error) {
		return String(error.message);
	}

	return null;
};

/**
 * Checks if a field has validation errors.
 * Useful for conditional styling or rendering.
 *
 * @param errors - Array of validation errors from field.state.meta.errors
 * @returns true if there are errors, false otherwise
 *
 * @example
 * ```tsx
 * <input
 *   className={hasFieldError(field.state.meta.errors) ? 'error' : ''}
 * />
 * ```
 */
export const hasFieldError = (errors: unknown[]): boolean => {
	return getErrorMessage(errors) !== null;
};
