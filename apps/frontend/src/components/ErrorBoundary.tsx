import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
	errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component that catches React rendering errors
 * and displays a fallback UI instead of crashing the entire app.
 *
 * @example
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
		};
	}

	static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
		// Update state so the next render will show the fallback UI
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// Log error to console (you can replace this with error tracking service later)
		console.error('ErrorBoundary caught an error:', error, errorInfo);

		this.setState({
			error,
			errorInfo,
		});
	}

	handleReset = () => {
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null,
		});
	};

	render() {
		if (this.state.hasError) {
			// Use custom fallback if provided
			if (this.props.fallback && this.state.error && this.state.errorInfo) {
				return this.props.fallback(this.state.error, this.state.errorInfo);
			}

			// Default fallback UI
			return (
				<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
					<div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="flex-shrink-0">
								<svg
									className="h-8 w-8 text-red-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<title>Error</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
									/>
								</svg>
							</div>
							<div>
								<h1 className="text-xl font-semibold text-gray-900">
									Something went wrong
								</h1>
							</div>
						</div>

						<div className="mb-4">
							<p className="text-sm text-gray-600 mb-2">
								An unexpected error occurred. Please try refreshing the page.
							</p>

							{/* Show error details in development */}
							{import.meta.env.DEV && this.state.error && (
								<details className="mt-4">
									<summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
										Error Details (Development Only)
									</summary>
									<div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
										<p className="text-xs font-mono text-red-600 mb-2">
											{this.state.error.toString()}
										</p>
										{this.state.errorInfo?.componentStack && (
											<pre className="text-xs font-mono text-gray-600 overflow-auto max-h-40">
												{this.state.errorInfo.componentStack}
											</pre>
										)}
									</div>
								</details>
							)}
						</div>

						<div className="flex gap-3">
							<button
								type="button"
								onClick={() => window.location.reload()}
								className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
							>
								Reload Page
							</button>
							<button
								type="button"
								onClick={this.handleReset}
								className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
							>
								Try Again
							</button>
						</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
