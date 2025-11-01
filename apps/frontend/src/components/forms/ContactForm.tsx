/**
 * Contact Form - Simple standalone TanStack Form example
 * Demonstrates basic form usage without composition or field groups
 */

import { toast } from '@components/ToastContainer';
import { useAppForm } from '@lib/form-composition';
import { getErrorMessage } from '@utils/form';
import { z } from 'zod';

// Simple Zod schema for contact form
const contactFormSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters'),
	email: z.email({ message: 'Please enter a valid email address' }),
	subject: z.string().min(5, 'Subject must be at least 5 characters'),
	message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Infer TypeScript type from Zod schema
type ContactFormValues = z.infer<typeof contactFormSchema>;

// Default values
const defaultValues: ContactFormValues = {
	name: '',
	email: '',
	subject: '',
	message: '',
};

export const ContactForm = () => {
	const form = useAppForm({
		defaultValues,
		validators: {
			onChange: contactFormSchema,
		},
		onSubmit: async ({ value }) => {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			console.log('Contact form submitted:', value);
			toast.success('Message sent successfully!');
		},
	});

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
			<h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
				Contact Us
			</h2>
			<p className="text-gray-600 dark:text-gray-400 mb-6">
				Simple standalone form without composition or field groups
			</p>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-6"
			>
				{/* Name Field */}
				<form.Field
					name="name"
					children={(field) => (
						<div>
							<label
								htmlFor={field.name}
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								Name <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
									${
										getErrorMessage(field.state.meta.errors)
											? 'border-red-500 focus:ring-red-500'
											: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
									}
									dark:bg-gray-700 dark:text-white`}
								placeholder="John Doe"
							/>
							{getErrorMessage(field.state.meta.errors) && (
								<p className="mt-1 text-sm text-red-500">
									{getErrorMessage(field.state.meta.errors)}
								</p>
							)}
						</div>
					)}
				/>

				{/* Email Field */}
				<form.Field
					name="email"
					children={(field) => (
						<div>
							<label
								htmlFor={field.name}
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								Email <span className="text-red-500">*</span>
							</label>
							<input
								type="email"
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
									${
										getErrorMessage(field.state.meta.errors)
											? 'border-red-500 focus:ring-red-500'
											: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
									}
									dark:bg-gray-700 dark:text-white`}
								placeholder="john@example.com"
							/>
							{getErrorMessage(field.state.meta.errors) && (
								<p className="mt-1 text-sm text-red-500">
									{getErrorMessage(field.state.meta.errors)}
								</p>
							)}
						</div>
					)}
				/>

				{/* Subject Field */}
				<form.Field
					name="subject"
					children={(field) => (
						<div>
							<label
								htmlFor={field.name}
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								Subject <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
									${
										getErrorMessage(field.state.meta.errors)
											? 'border-red-500 focus:ring-red-500'
											: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
									}
									dark:bg-gray-700 dark:text-white`}
								placeholder="How can we help?"
							/>
							{getErrorMessage(field.state.meta.errors) && (
								<p className="mt-1 text-sm text-red-500">
									{getErrorMessage(field.state.meta.errors)}
								</p>
							)}
						</div>
					)}
				/>

				{/* Message Field */}
				<form.Field
					name="message"
					children={(field) => (
						<div>
							<label
								htmlFor={field.name}
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								Message <span className="text-red-500">*</span>
							</label>
							<textarea
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								rows={6}
								className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
									${
										getErrorMessage(field.state.meta.errors)
											? 'border-red-500 focus:ring-red-500'
											: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
									}
									dark:bg-gray-700 dark:text-white resize-none`}
								placeholder="Tell us what's on your mind..."
							/>
							{getErrorMessage(field.state.meta.errors) && (
								<p className="mt-1 text-sm text-red-500">
									{getErrorMessage(field.state.meta.errors)}
								</p>
							)}
						</div>
					)}
				/>

				{/* Submit Button */}
				<div className="pt-4">
					<form.Subscribe
						selector={(state) => ({
							canSubmit: state.canSubmit,
							isSubmitting: state.isSubmitting,
						})}
						children={(state) => (
							<button
								type="submit"
								disabled={!state.canSubmit}
								className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
							>
								{state.isSubmitting ? 'Sending...' : 'Send Message'}
							</button>
						)}
					/>
				</div>
			</form>

			{/* Form State Preview */}
			<div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
				<h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
					Form State (Debug):
				</h3>
				<form.Subscribe
					selector={(state) => state.values}
					children={(values) => (
						<pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
							{JSON.stringify(values, null, 2)}
						</pre>
					)}
				/>
			</div>
		</div>
	);
};
