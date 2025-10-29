import { useAuth } from '@context/AuthContext';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';

const Layout = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { user, logout } = useAuth();

	const isActive = (path: string) => {
		return location.pathname === path;
	};

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
			<nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
				<div className="max-w-4xl mx-auto px-8 py-4">
					<div className="flex items-center justify-between">
						<Link
							to="/"
							className="text-xl font-bold text-gray-900 dark:text-white"
						>
							Project Starter
						</Link>
						<div className="flex items-center gap-6">
							<Link
								to="/"
								className={`transition-colors ${
									isActive('/')
										? 'text-blue-600 dark:text-blue-400 font-semibold'
										: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
								}`}
							>
								Home
							</Link>
							<Link
								to="/api-demo"
								className={`transition-colors ${
									isActive('/api-demo')
										? 'text-blue-600 dark:text-blue-400 font-semibold'
										: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
								}`}
							>
								API Demo
							</Link>
							<Link
								to="/about"
								className={`transition-colors ${
									isActive('/about')
										? 'text-blue-600 dark:text-blue-400 font-semibold'
										: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
								}`}
							>
								About
							</Link>
							{user && (
								<div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-300 dark:border-gray-600">
									<span className="text-sm text-gray-600 dark:text-gray-400">
										{user.email}
									</span>
									<button
										type="button"
										onClick={handleLogout}
										className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
									>
										Logout
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</nav>

			<main className="max-w-4xl mx-auto px-8 py-12">
				<Outlet />
			</main>

			<footer className="max-w-4xl mx-auto px-8 py-8 mt-12 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
				Built with React, NestJS, TypeScript, and Tailwind CSS
			</footer>
		</div>
	);
};

export default Layout;
