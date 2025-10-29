import { useEffect, useState } from 'react';

interface HealthResponse {
	status: string;
	timestamp: string;
	uptime: number;
	environment: string;
	platform: string;
	nodeVersion: string;
}

const App = () => {
	const [health, setHealth] = useState<HealthResponse | null>(null);
	const [error, setError] = useState<string>('');

	useEffect(() => {
		const fetchHealth = async () => {
			try {
				const res = await fetch('/api/health');
				const data = await res.json();
				setHealth(data);
			} catch {
				setError('Failed to connect to backend');
			}
		};

		fetchHealth();
	}, []);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 font-sans">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
					Project Starter
				</h1>

				{error && (
					<div className="p-4 bg-red-50 border border-red-300 rounded text-red-700 mb-6">
						{error}
					</div>
				)}

				{health && (
					<div>
						<h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
							Backend Health
						</h2>
						<pre className="bg-gray-800 text-gray-200 p-4 rounded-lg overflow-auto text-sm leading-relaxed">
							<code>{JSON.stringify(health, null, 2)}</code>
						</pre>
					</div>
				)}

				{!health && !error && (
					<div className="p-4 text-gray-600 dark:text-gray-400">
						Loading backend health...
					</div>
				)}
			</div>
		</div>
	);
};

export default App;
