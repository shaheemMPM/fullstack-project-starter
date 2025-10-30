import { useState } from 'react';
import Toast, { type ToastMessage } from './Toast';

let addToastFn: ((message: string, type: ToastMessage['type']) => void) | null =
	null;

/**
 * Toast container that displays toast notifications
 * Should be rendered once at the root of your app
 */
const ToastContainer = () => {
	const [toasts, setToasts] = useState<ToastMessage[]>([]);

	const addToast = (message: string, type: ToastMessage['type']) => {
		const id = Math.random().toString(36).substring(7);
		setToasts((prev) => [...prev, { id, message, type }]);
	};

	const removeToast = (id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	};

	// Store the function globally so it can be called from anywhere
	addToastFn = addToast;

	return (
		<div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
			{toasts.map((toast) => (
				<Toast key={toast.id} toast={toast} onClose={removeToast} />
			))}
		</div>
	);
};

/**
 * Show a success toast notification
 * @example toast.success('User created successfully')
 */
const success = (message: string) => {
	addToastFn?.(message, 'success');
};

/**
 * Show an error toast notification
 * @example toast.error('Failed to save changes')
 */
const error = (message: string) => {
	addToastFn?.(message, 'error');
};

/**
 * Show an info toast notification
 * @example toast.info('New updates available')
 */
const info = (message: string) => {
	addToastFn?.(message, 'info');
};

/**
 * Show a warning toast notification
 * @example toast.warning('Your session will expire soon')
 */
const warning = (message: string) => {
	addToastFn?.(message, 'warning');
};

/**
 * Toast notification API
 * Import and use anywhere in your app:
 *
 * @example
 * import { toast } from '@components/ToastContainer';
 * toast.success('Operation completed!');
 * toast.error('Something went wrong');
 */
export const toast = {
	success,
	error,
	info,
	warning,
};

export default ToastContainer;
