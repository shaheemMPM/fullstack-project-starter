import { api } from '@lib/api';
import type { HealthResponse } from '@repo/api-client';
import { useState } from 'react';

/**
 * Example component showing how to use the API client
 * Demonstrates the health check endpoint with full type safety
 */
export const ApiExample = () => {
	const [health, setHealth] = useState<HealthResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>('');

	const handleHealthCheck = async () => {
		setLoading(true);
		setError('');
		setHealth(null);
		try {
			const result = await api.health.check();
			setHealth(result);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
			<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
				API Client Example
			</h2>

			<p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
				This example shows how to use the type-safe API client to call backend
				endpoints.
			</p>

			<button
				type="button"
				onClick={handleHealthCheck}
				disabled={loading}
				className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
			>
				{loading ? 'Checking...' : 'Check Backend Health'}
			</button>

			{error && (
				<div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-400 text-sm">
					Error: {error}
				</div>
			)}

			{health && (
				<div className="mt-4">
					<h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
						Response:
					</h3>
					<pre className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 rounded text-xs overflow-x-auto">
						<code className="text-gray-800 dark:text-gray-200">
							{JSON.stringify(health, null, 2)}
						</code>
					</pre>
				</div>
			)}

			<div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
				<h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
					Code Example:
				</h3>
				<pre className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 rounded text-xs overflow-x-auto">
					<code className="text-gray-800 dark:text-gray-200">
						{`import { api } from '@lib/api';

// Call the health check endpoint
const health = await api.health.check();

// Full type safety - TypeScript knows the exact shape
console.log(health.status);      // 'ok'
console.log(health.timestamp);   // ISO string
console.log(health.uptime);      // number
console.log(health.environment); // string`}
					</code>
				</pre>
			</div>
		</div>
	);
};
