import Layout from '@components/Layout';
import ProtectedRoute from '@components/ProtectedRoute';
import { AuthProvider } from '@context/AuthContext';
import AboutPage from '@pages/AboutPage';
import ApiDemoPage from '@pages/ApiDemoPage';
import HomePage from '@pages/HomePage';
import LoginPage from '@pages/LoginPage';
import SignupPage from '@pages/SignupPage';
import { BrowserRouter, Route, Routes } from 'react-router';

const App = () => {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					{/* Public routes */}
					<Route path="/login" element={<LoginPage />} />
					<Route path="/signup" element={<SignupPage />} />

					{/* Protected routes */}
					<Route
						element={
							<ProtectedRoute>
								<Layout />
							</ProtectedRoute>
						}
					>
						<Route path="/" element={<HomePage />} />
						<Route path="/about" element={<AboutPage />} />
						<Route path="/api-demo" element={<ApiDemoPage />} />
					</Route>
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
};

export default App;
