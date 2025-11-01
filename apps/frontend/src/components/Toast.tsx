import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
	id: string;
	message: string;
	type: ToastType;
	duration?: number;
}

interface ToastProps {
	toast: ToastMessage;
	onClose: (id: string) => void;
}

const Toast = ({ toast, onClose }: ToastProps) => {
	const [isExiting, setIsExiting] = useState(false);

	useEffect(() => {
		const duration = toast.duration || 5000;
		const timer = setTimeout(() => {
			setIsExiting(true);
			setTimeout(() => onClose(toast.id), 300); // Wait for exit animation
		}, duration);

		return () => clearTimeout(timer);
	}, [toast.id, toast.duration, onClose]);

	const getIcon = () => {
		switch (toast.type) {
			case 'success':
				return (
					<svg
						className="h-5 w-5 text-green-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<title>Success</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				);
			case 'error':
				return (
					<svg
						className="h-5 w-5 text-red-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<title>Error</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				);
			case 'warning':
				return (
					<svg
						className="h-5 w-5 text-yellow-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<title>Warning</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
				);
			case 'info':
				return (
					<svg
						className="h-5 w-5 text-blue-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<title>Info</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				);
		}
	};

	const getBgColor = () => {
		switch (toast.type) {
			case 'success':
				return 'bg-green-50 border-green-200';
			case 'error':
				return 'bg-red-50 border-red-200';
			case 'warning':
				return 'bg-yellow-50 border-yellow-200';
			case 'info':
				return 'bg-blue-50 border-blue-200';
		}
	};

	return (
		<div
			className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-sm transition-all duration-300 ${getBgColor()} ${
				isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
			}`}
		>
			<div className="flex-shrink-0">{getIcon()}</div>
			<div className="flex-1 text-sm text-gray-700">{toast.message}</div>
			<button
				type="button"
				onClick={() => {
					setIsExiting(true);
					setTimeout(() => onClose(toast.id), 300);
				}}
				className="flex-shrink-0 text-gray-400 hover:text-gray-600"
			>
				<svg
					className="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<title>Close</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>
	);
};

export default Toast;
