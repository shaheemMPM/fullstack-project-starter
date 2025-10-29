import { useAuth } from '@context';
import type { ApiClientError } from '@repo/api-client';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

const LoginPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setIsLoading(true);

		try {
			await login({ email, password });
			navigate('/');
		} catch (err) {
			const apiError = err as ApiClientError;
			setError(
				apiError.message ||
					'Failed to login. Please check your credentials and try again.',
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-8">
			<div className="w-full max-w-md">
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-200 dark:border-gray-700">
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
							Welcome Back
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Sign in to your account
						</p>
					</div>

					{error && (
						<div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
							<p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								Email
							</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
								placeholder="you@example.com"
							/>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								Password
							</label>
							<input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
								placeholder="••••••••"
							/>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{isLoading ? 'Signing in...' : 'Sign in'}
						</button>
					</form>

					<div className="mt-6 text-center">
						<p className="text-gray-600 dark:text-gray-400 text-sm">
							Don't have an account?{' '}
							<Link
								to="/signup"
								className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
							>
								Sign up
							</Link>
						</p>
					</div>
				</div>

				<div className="mt-6 text-center">
					<Link
						to="/"
						className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
					>
						← Back to home
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
