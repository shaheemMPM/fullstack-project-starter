import { useAuth } from '@context';
import type { ApiClientError } from '@repo/api-client';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

const SignupPage = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const { signup } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (password !== confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		if (password.length < 6) {
			setError('Password must be at least 6 characters long');
			return;
		}

		setIsLoading(true);

		try {
			await signup({ email, password, name: name || undefined });
			navigate('/');
		} catch (err) {
			const apiError = err as ApiClientError;
			setError(
				apiError.message || 'Failed to create account. Please try again.',
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-8">
			<div className="w-full max-w-md">
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-200 dark:border-gray-700">
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
							Create Account
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Sign up to get started
						</p>
					</div>

					{error && (
						<div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
							<p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-5">
						<div>
							<label
								htmlFor="name"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								Name (optional)
							</label>
							<input
								id="name"
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
								placeholder="John Doe"
							/>
						</div>

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
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
								placeholder="••••••••"
							/>
						</div>

						<div>
							<label
								htmlFor="confirmPassword"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								Confirm Password
							</label>
							<input
								id="confirmPassword"
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
								placeholder="••••••••"
							/>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{isLoading ? 'Creating account...' : 'Sign up'}
						</button>
					</form>

					<div className="mt-6 text-center">
						<p className="text-gray-600 dark:text-gray-400 text-sm">
							Already have an account?{' '}
							<Link
								to="/login"
								className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
							>
								Sign in
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

export default SignupPage;
