import { useState, useEffect } from 'react';
import './App.css';

function App() {
	const [message, setMessage] = useState<string>('Loading...');

	useEffect(() => {
		fetch('http://localhost:3000/api/health')
			.then((res) => res.text())
			.then((data) => setMessage(data))
			.catch(() => setMessage('Failed to connect to backend'));
	}, []);

	return (
		<div>
			<h1>Project Starter</h1>
			<p>
				Message from backend: <strong>{message}</strong>
			</p>
		</div>
	);
}

export default App;
