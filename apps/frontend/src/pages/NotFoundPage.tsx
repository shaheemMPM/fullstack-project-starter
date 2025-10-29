import { Link } from 'react-router';

const NotFoundPage = () => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-8">
			<div className="text-center">
				<div className="mb-8">
					<h1 className="text-9xl font-bold text-gray-300 dark:text-gray-700">
						404
					</h1>
					<div className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
						Page Not Found
					</div>
					<p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
						The page you're looking for doesn't exist or has been moved.
					</p>
				</div>

				<div className="flex gap-4 justify-center">
					<Link
						to="/"
						className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
					>
						Go Home
					</Link>
					<button
						type="button"
						onClick={() => window.history.back()}
						className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
					>
						Go Back
					</button>
				</div>
			</div>
		</div>
	);
};

export default NotFoundPage;
