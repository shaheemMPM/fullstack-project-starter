import Layout from '@components/Layout';
import ProtectedRoute from '@components/ProtectedRoute';
import PublicRoute from '@components/PublicRoute';
import { AuthProvider } from '@context';
import AboutPage from '@pages/AboutPage';
import ApiDemoPage from '@pages/ApiDemoPage';
import HomePage from '@pages/HomePage';
import LoginPage from '@pages/LoginPage';
import NotFoundPage from '@pages/NotFoundPage';
import SignupPage from '@pages/SignupPage';
import { BrowserRouter, Route, Routes } from 'react-router';

const App = () => {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					{/* Public routes - redirect to home if authenticated */}
					<Route
						path="/login"
						element={
							<PublicRoute>
								<LoginPage />
							</PublicRoute>
						}
					/>
					<Route
						path="/signup"
						element={
							<PublicRoute>
								<SignupPage />
							</PublicRoute>
						}
					/>

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

					{/* 404 catch-all route */}
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
};

export default App;
