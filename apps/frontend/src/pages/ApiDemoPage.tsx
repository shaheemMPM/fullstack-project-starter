import { ApiExample } from '@components/ApiExample';

const ApiDemoPage = () => {
	return (
		<div className="space-y-6">
			<section>
				<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
					API Demo
				</h1>
				<p className="text-lg text-gray-600 dark:text-gray-400">
					See the type-safe API client in action with real backend calls.
				</p>
			</section>

			<ApiExample />
		</div>
	);
};

export default ApiDemoPage;
