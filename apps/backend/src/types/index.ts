/**
 * Central export point for types that can be safely imported by frontend/api-client
 *
 * This file re-exports types from their source modules.
 * Types are defined in separate .types.ts files with no dependencies.
 */

// Re-export auth types (no dependencies, safe to import)
export type {
	AuthResponse,
	JwtPayload,
	UserResponse,
} from '../modules/auth/auth.types';

// Re-export health types (no dependencies, safe to import)
export type { HealthResponse } from '../modules/health/health.types';

// DTOs - Plain type equivalents since actual DTOs have class-validator decorators
// These must be manually kept in sync with the DTO classes
export type SignupDto = {
	email: string;
	password: string;
	name?: string;
};

export type LoginDto = {
	email: string;
	password: string;
};

export type ChangePasswordDto = {
	currentPassword: string;
	newPassword: string;
};
