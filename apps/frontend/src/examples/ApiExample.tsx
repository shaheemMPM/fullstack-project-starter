import type { ApiClientError } from '@repo/api-client';
import { useState } from 'react';
import { api } from '../lib/api';

/**
 * Example component showing how to use the API client
 * This demonstrates all available endpoints with full type safety
 */
export const ApiExample = () => {
	const [status, setStatus] = useState<string>('');
	const [loading, setLoading] = useState(false);

	const handleSignup = async () => {
		setLoading(true);
		setStatus('');
		try {
			const response = await api.auth.signup({
				email: 'user@example.com',
				password: 'password123',
				name: 'Test User',
			});
			setStatus(
				`Signed up! Token: ${response.access_token.substring(0, 20)}...`,
			);
			console.log('User:', response.user);
		} catch (error) {
			if (error instanceof Error) {
				setStatus(`Error: ${error.message}`);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleLogin = async () => {
		setLoading(true);
		setStatus('');
		try {
			const response = await api.auth.login({
				email: 'user@example.com',
				password: 'password123',
			});
			setStatus(`Logged in! Token saved automatically`);
			console.log('User:', response.user);
		} catch (error) {
			const apiError = error as ApiClientError;
			setStatus(`Error ${apiError.statusCode}: ${apiError.message}`);
		} finally {
			setLoading(false);
		}
	};

	const handleGetMe = async () => {
		setLoading(true);
		setStatus('');
		try {
			const user = await api.auth.me();
			setStatus(`User: ${user.email}`);
			console.log('User data:', user);
		} catch (error) {
			if (error instanceof Error) {
				setStatus(`Error: ${error.message}`);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleChangePassword = async () => {
		setLoading(true);
		setStatus('');
		try {
			const response = await api.auth.changePassword({
				currentPassword: 'password123',
				newPassword: 'newpassword123',
			});
			setStatus(response.message);
		} catch (error) {
			if (error instanceof Error) {
				setStatus(`Error: ${error.message}`);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = () => {
		api.auth.logout();
		setStatus('Logged out - token cleared');
	};

	const handleHealthCheck = async () => {
		setLoading(true);
		setStatus('');
		try {
			const health = await api.health.check();
			setStatus(`Health: ${health.status} at ${health.timestamp}`);
		} catch (error) {
			if (error instanceof Error) {
				setStatus(`Error: ${error.message}`);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-8 max-w-2xl mx-auto">
			<h1 className="text-2xl font-bold mb-6">API Client Example</h1>

			<div className="space-y-2 mb-4">
				<p className="text-sm text-gray-600">
					Authenticated: {api.isAuthenticated() ? '✅ Yes' : '❌ No'}
				</p>
				{status && (
					<p className="p-3 bg-gray-100 rounded text-sm font-mono">{status}</p>
				)}
			</div>

			<div className="grid grid-cols-2 gap-2">
				<button
					type="button"
					onClick={handleHealthCheck}
					disabled={loading}
					className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
				>
					Health Check
				</button>

				<button
					type="button"
					onClick={handleSignup}
					disabled={loading}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
				>
					Signup
				</button>

				<button
					type="button"
					onClick={handleLogin}
					disabled={loading}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
				>
					Login
				</button>

				<button
					type="button"
					onClick={handleGetMe}
					disabled={loading}
					className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
				>
					Get Me
				</button>

				<button
					type="button"
					onClick={handleChangePassword}
					disabled={loading}
					className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
				>
					Change Password
				</button>

				<button
					type="button"
					onClick={handleLogout}
					disabled={loading}
					className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
				>
					Logout
				</button>
			</div>

			<div className="mt-6 p-4 bg-gray-50 rounded text-sm">
				<h2 className="font-bold mb-2">Usage Example:</h2>
				<pre className="text-xs overflow-x-auto">
					{`import { api } from './lib/api';

// Signup
const response = await api.auth.signup({
  email: 'user@example.com',
  password: 'password123',
  name: 'Test User'
});

// Login
await api.auth.login({
  email: 'user@example.com',
  password: 'password123'
});

// Get current user
const user = await api.auth.me();

// Change password
await api.auth.changePassword({
  currentPassword: 'old',
  newPassword: 'new'
});

// Logout
api.auth.logout();

// Health check
const health = await api.health.check();`}
				</pre>
			</div>
		</div>
	);
};
