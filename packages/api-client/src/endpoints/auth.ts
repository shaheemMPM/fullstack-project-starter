import type { ApiClient } from '../client';
import type {
	AuthResponse,
	ChangePasswordDto,
	LoginDto,
	SignupDto,
	UserResponse,
} from '../types';

export class AuthEndpoints {
	constructor(private client: ApiClient) {}

	/**
	 * Sign up a new user
	 */
	async signup(data: SignupDto): Promise<AuthResponse> {
		const response = await this.client.post<AuthResponse>(
			'/api/auth/signup',
			data,
		);
		// Automatically set token after successful signup
		this.client.setToken(response.access_token);
		return response;
	}

	/**
	 * Login with email and password
	 */
	async login(data: LoginDto): Promise<AuthResponse> {
		const response = await this.client.post<AuthResponse>(
			'/api/auth/login',
			data,
		);
		// Automatically set token after successful login
		this.client.setToken(response.access_token);
		return response;
	}

	/**
	 * Get current user information (requires authentication)
	 */
	async me(): Promise<UserResponse> {
		return this.client.get<UserResponse>('/api/auth/me');
	}

	/**
	 * Change password for current user (requires authentication)
	 */
	async changePassword(data: ChangePasswordDto): Promise<{ message: string }> {
		return this.client.put<{ message: string }>(
			'/api/auth/change-password',
			data,
		);
	}

	/**
	 * Logout - clears the token
	 */
	logout(): void {
		this.client.setToken(null);
	}
}
