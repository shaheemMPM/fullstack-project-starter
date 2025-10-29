// Auth DTOs
export interface SignupDto {
	email: string;
	password: string;
	name?: string;
}

export interface LoginDto {
	email: string;
	password: string;
}

export interface ChangePasswordDto {
	currentPassword: string;
	newPassword: string;
}

// Auth Response
export interface AuthResponse {
	access_token: string;
	user: {
		id: number;
		email: string;
		name: string | null;
	};
}

// User Response
export interface UserResponse {
	id: number;
	email: string;
}

// Health Response
export interface HealthResponse {
	status: string;
	timestamp: string;
}

// API Error Response
export interface ApiError {
	statusCode: number;
	message: string | string[];
	error?: string;
}
