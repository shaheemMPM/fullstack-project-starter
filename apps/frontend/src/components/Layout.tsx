import { useAuth } from '@context';
import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';

const Layout = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { user, logout } = useAuth();
	const [isDemosOpen, setIsDemosOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const isActive = (path: string) => {
		return location.pathname === path;
	};

	const isDemosActive = () => {
		return (
			location.pathname === '/api-demo' ||
			location.pathname === '/form-demo' ||
			location.pathname === '/errors-demo'
		);
	};

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	const toggleDemos = () => {
		setIsDemosOpen((prev) => !prev);
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDemosOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

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
								to="/about"
								className={`transition-colors ${
									isActive('/about')
										? 'text-blue-600 dark:text-blue-400 font-semibold'
										: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
								}`}
							>
								About
							</Link>

							{/* Demos Dropdown */}
							<div className="relative" ref={dropdownRef}>
								<button
									type="button"
									onClick={toggleDemos}
									className={`transition-colors flex items-center gap-1 ${
										isDemosActive()
											? 'text-blue-600 dark:text-blue-400 font-semibold'
											: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
									}`}
								>
									Demos
									<svg
										className={`w-4 h-4 transition-transform ${isDemosOpen ? 'rotate-180' : ''}`}
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<title>Dropdown Arrow</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</button>

								{/* Dropdown Menu */}
								{isDemosOpen && (
									<div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
										<Link
											to="/api-demo"
											onClick={() => setIsDemosOpen(false)}
											className={`block px-4 py-2.5 transition-colors ${
												isActive('/api-demo')
													? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
													: 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
											}`}
										>
											API Demo
										</Link>
										<Link
											to="/form-demo"
											onClick={() => setIsDemosOpen(false)}
											className={`block px-4 py-2.5 transition-colors ${
												isActive('/form-demo')
													? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
													: 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
											}`}
										>
											Form Demo
										</Link>
										<Link
											to="/errors-demo"
											onClick={() => setIsDemosOpen(false)}
											className={`block px-4 py-2.5 transition-colors ${
												isActive('/errors-demo')
													? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
													: 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
											}`}
										>
											Errors Demo
										</Link>
									</div>
								)}
							</div>
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
