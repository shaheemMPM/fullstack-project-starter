import { toast } from '@components/ToastContainer';
import { api } from '@lib/api';
import {
	getErrorMessage,
	getValidationErrors,
	isAuthError,
	isValidationError,
} from '@utils/error';
import { useState } from 'react';

/**
 * Error Test Page - Demonstrates all error handling features
 * This page is for testing/demo purposes only
 */
const ErrorTestPage = () => {
	const [shouldThrowError, setShouldThrowError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [apiResponse, setApiResponse] = useState<string>('');

	// Test 1: Throw a rendering error (will be caught by ErrorBoundary)
	if (shouldThrowError) {
		throw new Error('This is a test error caught by ErrorBoundary!');
	}

	// Test 2: Toast Notifications
	const testToasts = () => {
		toast.success('Success! Operation completed successfully');
		setTimeout(() => toast.error('Error! Something went wrong'), 500);
		setTimeout(() => toast.warning('Warning! Please check your input'), 1000);
		setTimeout(() => toast.info('Info! New updates available'), 1500);
	};

	// Test 3: API Validation Error
	const testValidationError = async () => {
		setIsLoading(true);
		setApiResponse('');
		try {
			// This will fail validation (invalid email, short password)
			await api.auth.signup({
				email: 'invalid-email',
				password: '123',
			});
		} catch (error) {
			if (isValidationError(error)) {
				const errors = getValidationErrors(error);
				setApiResponse(`Validation Errors:\n${errors.join('\n')}`);
				toast.error('Validation failed! Check the errors below');
			} else {
				setApiResponse(`Error: ${getErrorMessage(error)}`);
				toast.error(getErrorMessage(error));
			}
		} finally {
			setIsLoading(false);
		}
	};

	// Test 4: API Conflict Error (duplicate email)
	const testConflictError = async () => {
		setIsLoading(true);
		setApiResponse('');
		try {
			// Try to signup with an email that might already exist
			await api.auth.signup({
				email: 'test@example.com',
				password: 'password123',
			});
		} catch (error) {
			setApiResponse(`Error: ${getErrorMessage(error)}`);
			toast.error(getErrorMessage(error));
		} finally {
			setIsLoading(false);
		}
	};

	// Test 5: Auth Error (401)
	const testAuthError = async () => {
		setIsLoading(true);
		setApiResponse('');
		try {
			// Try to login with invalid credentials
			await api.auth.login({
				email: 'wrong@example.com',
				password: 'wrongpassword',
			});
		} catch (error) {
			if (isAuthError(error)) {
				setApiResponse('Auth Error (401): Invalid credentials');
				toast.error('Authentication failed!');
			} else {
				setApiResponse(`Error: ${getErrorMessage(error)}`);
				toast.error(getErrorMessage(error));
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="max-w-4xl mx-auto p-8">
			<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
				Error Handling Test Page
			</h1>
			<p className="text-gray-600 mb-8">
				Test all error handling features: Error Boundary, Toasts, API errors,
				and utility functions.
			</p>

			<div className="space-y-6">
				{/* Test 1: Error Boundary */}
				<section className="bg-white rounded-lg shadow p-6">
					<h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
						<span className="text-2xl">🛡️</span>
						Error Boundary Test
					</h2>
					<p className="text-gray-600 mb-4">
						Click this button to throw a rendering error. The ErrorBoundary
						component will catch it and show a fallback UI instead of a white
						screen.
					</p>
					<button
						type="button"
						onClick={() => setShouldThrowError(true)}
						className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
					>
						Throw Error (Test Error Boundary)
					</button>
					<p className="text-sm text-gray-500 mt-2">
						💡 After clicking, you'll see the ErrorBoundary fallback UI with
						"Reload Page" and "Try Again" buttons
					</p>
				</section>

				{/* Test 2: Toast Notifications */}
				<section className="bg-white rounded-lg shadow p-6">
					<h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
						<span className="text-2xl">🔔</span>
						Toast Notifications
					</h2>
					<p className="text-gray-600 mb-4">
						Show all 4 types of toast notifications (success, error, warning,
						info) at the top-right corner.
					</p>
					<button
						type="button"
						onClick={testToasts}
						className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
					>
						Show All Toasts
					</button>
					<p className="text-sm text-gray-500 mt-2">
						💡 Toasts will appear in sequence with different colors and
						auto-dismiss after 5 seconds
					</p>
				</section>

				{/* Test 3: Validation Errors */}
				<section className="bg-white rounded-lg shadow p-6">
					<h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
						<span className="text-2xl">✅</span>
						Validation Error Test
					</h2>
					<p className="text-gray-600 mb-4">
						Send invalid data to the API and see how validation errors are
						handled and displayed.
					</p>
					<button
						type="button"
						onClick={testValidationError}
						disabled={isLoading}
						className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
					>
						{isLoading ? 'Testing...' : 'Test Validation Error'}
					</button>
					<p className="text-sm text-gray-500 mt-2">
						💡 This will send invalid email and short password, triggering
						validation errors
					</p>
					{apiResponse && (
						<div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
							<pre className="text-sm text-gray-700 whitespace-pre-wrap">
								{apiResponse}
							</pre>
						</div>
					)}
				</section>

				{/* Test 4: Conflict Error */}
				<section className="bg-white rounded-lg shadow p-6">
					<h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
						<span className="text-2xl">⚠️</span>
						Conflict Error Test (409)
					</h2>
					<p className="text-gray-600 mb-4">
						Try to create a user with an email that might already exist to see
						conflict error handling.
					</p>
					<button
						type="button"
						onClick={testConflictError}
						disabled={isLoading}
						className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50"
					>
						{isLoading ? 'Testing...' : 'Test Conflict Error'}
					</button>
					<p className="text-sm text-gray-500 mt-2">
						💡 This will attempt to signup with test@example.com and show the
						conflict error
					</p>
				</section>

				{/* Test 5: Auth Error */}
				<section className="bg-white rounded-lg shadow p-6">
					<h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
						<span className="text-2xl">🔐</span>
						Auth Error Test (401)
					</h2>
					<p className="text-gray-600 mb-4">
						Try to login with invalid credentials to see auth error handling.
					</p>
					<button
						type="button"
						onClick={testAuthError}
						disabled={isLoading}
						className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
					>
						{isLoading ? 'Testing...' : 'Test Auth Error'}
					</button>
					<p className="text-sm text-gray-500 mt-2">
						💡 This will attempt to login with wrong credentials and trigger a
						401 error
					</p>
				</section>

				{/* Usage Examples */}
				<section className="bg-gray-50 rounded-lg border border-gray-200 p-6">
					<h2 className="text-xl font-semibold mb-3">📚 Usage Examples</h2>
					<div className="space-y-4 text-sm">
						<div>
							<h3 className="font-semibold text-gray-900 mb-1">
								Toast Notifications:
							</h3>
							<pre className="bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto">
								{`import { toast } from '@components/ToastContainer';

toast.success('Success message');
toast.error('Error message');
toast.warning('Warning message');
toast.info('Info message');`}
							</pre>
						</div>

						<div>
							<h3 className="font-semibold text-gray-900 mb-1">
								Error Handling:
							</h3>
							<pre className="bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto">
								{`import { getErrorMessage, isValidationError } from '@utils/error';

try {
  await api.auth.signup(data);
} catch (error) {
  if (isValidationError(error)) {
    const errors = getValidationErrors(error);
    setFormErrors(errors);
  }
  toast.error(getErrorMessage(error));
}`}
							</pre>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};

export default ErrorTestPage;
