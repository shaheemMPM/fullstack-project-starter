import { api } from '@lib/api';
import type { AuthResponse, LoginDto, SignupDto } from '@repo/api-client';
import { createContext, useEffect, useState } from 'react';

export interface AuthContextType {
	user: AuthResponse['user'] | null;
	isLoading: boolean;
	login: (credentials: LoginDto) => Promise<void>;
	signup: (credentials: SignupDto) => Promise<void>;
	logout: () => void;
	isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined,
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<AuthResponse['user'] | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkAuth = async () => {
			if (api.isAuthenticated()) {
				try {
					const userData = await api.auth.me();
					setUser({
						id: userData.id,
						email: userData.email,
						name: null,
					});
				} catch {
					// If auth check fails, clear the user state
					// The token will be automatically cleared by the ApiClient if it's a 401
					setUser(null);
				}
			}
			setIsLoading(false);
		};

		checkAuth();
	}, []);

	const login = async (credentials: LoginDto) => {
		const response = await api.auth.login(credentials);
		setUser(response.user);
	};

	const signup = async (credentials: SignupDto) => {
		const response = await api.auth.signup(credentials);
		setUser(response.user);
	};

	const logout = () => {
		api.auth.logout();
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				login,
				signup,
				logout,
				isAuthenticated: !!user || api.isAuthenticated(),
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
