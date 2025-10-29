/**
 * Token storage interface for managing authentication tokens
 */
export interface TokenStorage {
	getToken(): string | null;
	setToken(token: string): void;
	removeToken(): void;
}

/**
 * LocalStorage-based token storage for browser environments
 */
export class LocalStorageTokenStorage implements TokenStorage {
	constructor(private key = 'auth_token') {}

	getToken(): string | null {
		if (typeof window === 'undefined') return null;
		return localStorage.getItem(this.key);
	}

	setToken(token: string): void {
		if (typeof window === 'undefined') return;
		localStorage.setItem(this.key, token);
	}

	removeToken(): void {
		if (typeof window === 'undefined') return;
		localStorage.removeItem(this.key);
	}
}

/**
 * Memory-based token storage (useful for SSR or testing)
 */
export class MemoryTokenStorage implements TokenStorage {
	private token: string | null = null;

	getToken(): string | null {
		return this.token;
	}

	setToken(token: string): void {
		this.token = token;
	}

	removeToken(): void {
		this.token = null;
	}
}
