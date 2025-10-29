import { ApiExample } from './examples/ApiExample';

const App = () => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 font-sans">
			<div className="max-w-4xl mx-auto">
				<header className="mb-12">
					<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
						Project Starter
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Full-stack monorepo with NestJS backend, React frontend, and
						type-safe API client
					</p>
				</header>

				<main>
					<ApiExample />
				</main>

				<footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
					Built with React, NestJS, TypeScript, and Tailwind CSS
				</footer>
			</div>
		</div>
	);
};

export default App;
