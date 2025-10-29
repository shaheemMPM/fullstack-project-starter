/**
 * Re-export types from backend for single source of truth
 * Backend maintains these types in apps/backend/src/types/index.ts
 */
export type {
	AuthResponse,
	ChangePasswordDto,
	HealthResponse,
	JwtPayload,
	LoginDto,
	SignupDto,
	UserResponse,
} from 'backend/src/types';

// API Error Response
export interface ApiError {
	statusCode: number;
	message: string | string[];
	error?: string;
}
