/**
 * Plain TypeScript interfaces for auth module
 * No dependencies - safe to import from frontend/api-client
 */

export interface JwtPayload {
	sub: number; // user id
	email: string;
}

export interface AuthResponse {
	access_token: string;
	user: {
		id: number;
		email: string;
		name: string | null;
	};
}

export interface UserResponse {
	id: number;
	email: string;
}
