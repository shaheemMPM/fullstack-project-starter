import Layout from '@components/Layout';
import AboutPage from '@pages/AboutPage';
import ApiDemoPage from '@pages/ApiDemoPage';
import HomePage from '@pages/HomePage';
import { BrowserRouter, Route, Routes } from 'react-router';

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<HomePage />} />
					<Route path="/about" element={<AboutPage />} />
					<Route path="/api-demo" element={<ApiDemoPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default App;
