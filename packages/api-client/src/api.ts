import { ApiClient, type ApiClientConfig } from './client';
import { AuthEndpoints } from './endpoints/auth';
import { HealthEndpoints } from './endpoints/health';
import { LocalStorageTokenStorage, type TokenStorage } from './storage';

export interface ApiConfig extends Omit<ApiClientConfig, 'onAuthError'> {
	tokenStorage?: TokenStorage;
	onAuthError?: () => void;
}

/**
 * Main API class that provides access to all endpoints with authentication support
 *
 * @example
 * ```ts
 * // Create API instance
 * const api = new Api({
 *   baseUrl: 'http://localhost:3000',
 *   onAuthError: () => {
 *     // Redirect to login page or show error
 *   }
 * });
 *
 * // Use endpoints
 * const response = await api.auth.login({ email: 'user@example.com', password: 'password' });
 * const user = await api.auth.me();
 * ```
 */
export class Api {
	private client: ApiClient;
	private tokenStorage: TokenStorage;

	public readonly auth: AuthEndpoints;
	public readonly health: HealthEndpoints;

	constructor(config: ApiConfig) {
		this.tokenStorage = config.tokenStorage || new LocalStorageTokenStorage();

		// Create client with auth error handler
		this.client = new ApiClient({
			baseUrl: config.baseUrl,
			onAuthError: () => {
				this.tokenStorage.removeToken();
				if (config.onAuthError) {
					config.onAuthError();
				}
			},
		});

		// Initialize token from storage
		const storedToken = this.tokenStorage.getToken();
		if (storedToken) {
			this.client.setToken(storedToken);
		}

		// Initialize endpoints with token change callback
		this.auth = new AuthEndpoints(this.client, (token) =>
			this.setToken(token),
		);
		this.health = new HealthEndpoints(this.client);
	}

	/**
	 * Set authentication token
	 */
	setToken(token: string | null): void {
		this.client.setToken(token);
		if (token) {
			this.tokenStorage.setToken(token);
		} else {
			this.tokenStorage.removeToken();
		}
	}

	/**
	 * Get current authentication token
	 */
	getToken(): string | null {
		return this.client.getToken();
	}

	/**
	 * Check if user is authenticated
	 */
	isAuthenticated(): boolean {
		return this.client.getToken() !== null;
	}
}
