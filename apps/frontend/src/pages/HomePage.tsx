const HomePage = () => {
	return (
		<div className="space-y-8">
			<section>
				<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
					Welcome to Project Starter
				</h1>
				<p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
					A full-stack monorepo starter with NestJS backend, React frontend, and
					type-safe API client.
				</p>
			</section>

			<section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
					Features
				</h2>
				<ul className="space-y-3 text-gray-700 dark:text-gray-300">
					<li className="flex items-start">
						<span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
						<span>
							<strong>TypeScript monorepo</strong> with pnpm workspaces
						</span>
					</li>
					<li className="flex items-start">
						<span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
						<span>
							<strong>NestJS backend</strong> with JWT authentication
						</span>
					</li>
					<li className="flex items-start">
						<span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
						<span>
							<strong>React 19 frontend</strong> with Vite and Tailwind CSS
						</span>
					</li>
					<li className="flex items-start">
						<span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
						<span>
							<strong>Type-safe API client</strong> with shared types
						</span>
					</li>
					<li className="flex items-start">
						<span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
						<span>
							<strong>Drizzle ORM</strong> with PostgreSQL
						</span>
					</li>
					<li className="flex items-start">
						<span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
						<span>
							<strong>React Router v7</strong> for client-side routing
						</span>
					</li>
					<li className="flex items-start">
						<span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
						<span>
							<strong>Biome</strong> for linting and formatting
						</span>
					</li>
				</ul>
			</section>

			<section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
					Getting Started
				</h2>
				<p className="text-gray-700 dark:text-gray-300 mb-4">
					This starter includes everything you need to build a modern full-stack
					application. Check out the API Demo page to see the type-safe API
					client in action!
				</p>
				<div className="flex gap-3">
					<a
						href="/api-demo"
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						View API Demo
					</a>
					<a
						href="/about"
						className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
					>
						Learn More
					</a>
				</div>
			</section>
		</div>
	);
};

export default HomePage;
