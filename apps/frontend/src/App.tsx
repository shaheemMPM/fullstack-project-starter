import { useState, useEffect } from 'react';
import './App.css';

interface HealthResponse {
	status: string;
	timestamp: string;
	uptime: number;
	environment: string;
	platform: string;
	nodeVersion: string;
}

function App() {
	const [health, setHealth] = useState<HealthResponse | null>(null);
	const [error, setError] = useState<string>('');

	useEffect(() => {
		fetch('/api/health')
			.then((res) => res.json())
			.then((data) => setHealth(data))
			.catch(() => setError('Failed to connect to backend'));
	}, []);

	return (
		<div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
			<h1>Project Starter</h1>

			{error && (
				<div
					style={{
						padding: '1rem',
						background: '#fee',
						border: '1px solid #c33',
						borderRadius: '4px',
						color: '#c33',
					}}
				>
					{error}
				</div>
			)}

			{health && (
				<div>
					<h2>Backend Health</h2>
					<pre
						style={{
							background: '#1e1e1e',
							color: '#d4d4d4',
							padding: '1rem',
							borderRadius: '8px',
							overflow: 'auto',
							fontSize: '14px',
							lineHeight: '1.5',
						}}
					>
						<code>{JSON.stringify(health, null, 2)}</code>
					</pre>
				</div>
			)}

			{!health && !error && (
				<div style={{ padding: '1rem', color: '#666' }}>
					Loading backend health...
				</div>
			)}
		</div>
	);
}

export default App;
