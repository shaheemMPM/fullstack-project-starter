import { useAuth } from '@context';
import { Navigate } from 'react-router';

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
					<p className="text-gray-600 dark:text-gray-400">Loading...</p>
				</div>
			</div>
		);
	}

	if (isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	return <>{children}</>;
};

export default PublicRoute;
