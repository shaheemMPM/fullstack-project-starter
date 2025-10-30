import type { ApiError } from './types';

export interface ApiClientConfig {
	baseUrl: string;
	onAuthError?: () => void;
}

export class ApiClientError extends Error {
	public validationErrors?: Record<string, string[]>;

	constructor(
		public statusCode: number,
		public apiError: ApiError,
	) {
		super(
			Array.isArray(apiError.message)
				? apiError.message.join(', ')
				: apiError.message,
		);
		this.name = 'ApiClientError';
		this.validationErrors = apiError.validationErrors;
	}
}

export class ApiClient {
	private baseUrl: string;
	private token: string | null = null;
	private onAuthError?: () => void;

	constructor(config: ApiClientConfig) {
		this.baseUrl = config.baseUrl;
		this.onAuthError = config.onAuthError;
	}

	setToken(token: string | null): void {
		this.token = token;
	}

	getToken(): string | null {
		return this.token;
	}

	private async request<T>(
		endpoint: string,
		options: RequestInit = {},
	): Promise<T> {
		const url = `${this.baseUrl}${endpoint}`;

		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
			...(options.headers as Record<string, string>),
		};

		// Add authorization header if token exists
		if (this.token) {
			headers.Authorization = `Bearer ${this.token}`;
		}

		const response = await fetch(url, {
			...options,
			headers,
		});

		// Handle 401 Unauthorized
		if (response.status === 401) {
			this.token = null;
			if (this.onAuthError) {
				this.onAuthError();
			}
		}

		// Parse response
		const data = await response.json();

		// Handle error responses
		if (!response.ok) {
			throw new ApiClientError(response.status, data as ApiError);
		}

		return data as T;
	}

	async get<T>(endpoint: string): Promise<T> {
		return this.request<T>(endpoint, {
			method: 'GET',
		});
	}

	async post<T>(endpoint: string, body?: unknown): Promise<T> {
		return this.request<T>(endpoint, {
			method: 'POST',
			body: body ? JSON.stringify(body) : undefined,
		});
	}

	async put<T>(endpoint: string, body?: unknown): Promise<T> {
		return this.request<T>(endpoint, {
			method: 'PUT',
			body: body ? JSON.stringify(body) : undefined,
		});
	}

	async patch<T>(endpoint: string, body?: unknown): Promise<T> {
		return this.request<T>(endpoint, {
			method: 'PATCH',
			body: body ? JSON.stringify(body) : undefined,
		});
	}

	async delete<T>(endpoint: string): Promise<T> {
		return this.request<T>(endpoint, {
			method: 'DELETE',
		});
	}
}
