import { Api } from '@repo/api-client';

// Create a singleton API instance
export const api = new Api({
	baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
	onAuthError: () => {
		// Handle auth errors (e.g., redirect to login)
		console.error('Authentication error - please log in again');
		// You can add navigation logic here when you set up routing
	},
});
