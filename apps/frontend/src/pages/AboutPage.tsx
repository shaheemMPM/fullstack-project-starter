const AboutPage = () => {
	return (
		<div className="space-y-8">
			<section>
				<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
					About This Project
				</h1>
				<p className="text-lg text-gray-600 dark:text-gray-400">
					A modern full-stack starter template for building production-ready
					applications.
				</p>
			</section>

			<section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
					Tech Stack
				</h2>
				<div className="grid md:grid-cols-2 gap-6">
					<div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
							Frontend
						</h3>
						<ul className="space-y-2 text-gray-700 dark:text-gray-300">
							<li>• React 19 with TypeScript</li>
							<li>• Vite for blazing fast builds</li>
							<li>• Tailwind CSS for styling</li>
							<li>• React Router v7 for routing</li>
						</ul>
					</div>
					<div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
							Backend
						</h3>
						<ul className="space-y-2 text-gray-700 dark:text-gray-300">
							<li>• NestJS with TypeScript</li>
							<li>• Drizzle ORM with PostgreSQL</li>
							<li>• JWT authentication</li>
							<li>• Type-safe API client</li>
						</ul>
					</div>
				</div>
			</section>

			<section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
					Project Structure
				</h2>
				<pre className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4 rounded text-sm overflow-x-auto">
					<code className="text-gray-800 dark:text-gray-200">
						{`project-starter/
├── apps/
│   ├── backend/          # NestJS API
│   └── frontend/         # React app
├── packages/
│   └── api-client/       # Shared API client
└── package.json          # Workspace root`}
					</code>
				</pre>
			</section>

			<section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
					Key Features
				</h2>
				<div className="space-y-4 text-gray-700 dark:text-gray-300">
					<div>
						<h3 className="font-semibold text-gray-900 dark:text-white mb-2">
							Type Safety Everywhere
						</h3>
						<p>
							End-to-end type safety from database to frontend, with shared
							types between backend and frontend.
						</p>
					</div>
					<div>
						<h3 className="font-semibold text-gray-900 dark:text-white mb-2">
							Authentication Ready
						</h3>
						<p>
							JWT-based authentication with bcrypt password hashing, ready to
							use out of the box.
						</p>
					</div>
					<div>
						<h3 className="font-semibold text-gray-900 dark:text-white mb-2">
							Developer Experience
						</h3>
						<p>
							Hot reload, path aliases, automatic formatting with Biome, and
							more.
						</p>
					</div>
				</div>
			</section>
		</div>
	);
};

export default AboutPage;
