import { toast } from '@components/ToastContainer';
import { useForm } from '@tanstack/react-form';
import { getErrorMessage } from '@utils/form';
import { z } from 'zod';

// Zod schema for form validation
const formSchema = z.object({
	username: z
		.string()
		.min(3, 'Username must be at least 3 characters')
		.max(20, 'Username must be at most 20 characters'),
	email: z.email({ message: 'Please enter a valid email address' }),
	age: z
		.number()
		.min(13, 'You must be at least 13 years old')
		.max(120, 'Please enter a valid age'),
	birthdate: z.string().min(1, 'Birthdate is required'),
	bio: z.string(),
	role: z.string().min(1, 'Please select a role'),
	favoriteColor: z.string(),
	gender: z.string().min(1, 'Please select a gender'),
	newsletter: z.boolean(),
	terms: z.boolean().refine((val) => val === true, {
		message: 'You must accept the terms and conditions',
	}),
});

const FormDemoPage = () => {
	const form = useForm({
		defaultValues: {
			username: '',
			email: '',
			age: 18,
			birthdate: '',
			bio: '',
			role: '',
			favoriteColor: '#3b82f6',
			gender: '',
			newsletter: false,
			terms: false,
		},
		validators: {
			onChange: formSchema,
		},
		onSubmit: async ({ value }) => {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			console.log('Form submitted:', value);
			toast.success('Form submitted successfully!');
		},
	});

	return (
		<div className="max-w-3xl mx-auto">
			<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
				<h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
					Form Demo (TanStack Form + Zod)
				</h1>
				<p className="text-gray-600 dark:text-gray-400 mb-8">
					Comprehensive form demo using TanStack Form v1 with Zod validation and
					various input types
				</p>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-6"
				>
					{/* Text Input - Username */}
					<form.Field
						name="username"
						children={(field) => (
							<div>
								<label
									htmlFor={field.name}
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>
									Username <span className="text-red-500">*</span>
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
									placeholder="Enter your username"
								/>
								{getErrorMessage(field.state.meta.errors) && (
									<p className="mt-1 text-sm text-red-500">
										{getErrorMessage(field.state.meta.errors)}
									</p>
								)}
							</div>
						)}
					/>

					{/* Email Input */}
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
									placeholder="you@example.com"
								/>
								{getErrorMessage(field.state.meta.errors) && (
									<p className="mt-1 text-sm text-red-500">
										{getErrorMessage(field.state.meta.errors)}
									</p>
								)}
							</div>
						)}
					/>

					{/* Number Input - Age */}
					<form.Field
						name="age"
						children={(field) => (
							<div>
								<label
									htmlFor={field.name}
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>
									Age <span className="text-red-500">*</span>
								</label>
								<input
									type="number"
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(Number(e.target.value))}
									min={13}
									max={120}
									className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
										${
											getErrorMessage(field.state.meta.errors)
												? 'border-red-500 focus:ring-red-500'
												: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
										}
										dark:bg-gray-700 dark:text-white`}
								/>
								{getErrorMessage(field.state.meta.errors) && (
									<p className="mt-1 text-sm text-red-500">
										{getErrorMessage(field.state.meta.errors)}
									</p>
								)}
							</div>
						)}
					/>

					{/* Date Input */}
					<form.Field
						name="birthdate"
						children={(field) => (
							<div>
								<label
									htmlFor={field.name}
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>
									Birthdate <span className="text-red-500">*</span>
								</label>
								<input
									type="date"
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
								/>
								{getErrorMessage(field.state.meta.errors) && (
									<p className="mt-1 text-sm text-red-500">
										{getErrorMessage(field.state.meta.errors)}
									</p>
								)}
							</div>
						)}
					/>

					{/* Color Input */}
					<form.Field
						name="favoriteColor"
						children={(field) => (
							<div>
								<label
									htmlFor={field.name}
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>
									Favorite Color
								</label>
								<div className="flex items-center gap-3">
									<input
										type="color"
										id={field.name}
										name={field.name}
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										className="h-10 w-20 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
									/>
									<span className="text-sm text-gray-600 dark:text-gray-400">
										{field.state.value}
									</span>
								</div>
							</div>
						)}
					/>

					{/* Textarea */}
					<form.Field
						name="bio"
						children={(field) => (
							<div>
								<label
									htmlFor={field.name}
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>
									Bio
								</label>
								<textarea
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									rows={4}
									className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors dark:bg-gray-700 dark:text-white resize-none"
									placeholder="Tell us about yourself..."
								/>
							</div>
						)}
					/>

					{/* Select Dropdown */}
					<form.Field
						name="role"
						children={(field) => (
							<div>
								<label
									htmlFor={field.name}
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>
									Role <span className="text-red-500">*</span>
								</label>
								<select
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
								>
									<option value="">Select a role</option>
									<option value="developer">Developer</option>
									<option value="designer">Designer</option>
									<option value="manager">Manager</option>
									<option value="other">Other</option>
								</select>
								{getErrorMessage(field.state.meta.errors) && (
									<p className="mt-1 text-sm text-red-500">
										{getErrorMessage(field.state.meta.errors)}
									</p>
								)}
							</div>
						)}
					/>

					{/* Radio Buttons */}
					<form.Field
						name="gender"
						children={(field) => (
							<div>
								<div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Gender <span className="text-red-500">*</span>
								</div>
								<div className="space-y-2">
									{['male', 'female', 'other', 'prefer-not-to-say'].map(
										(option) => (
											<label key={option} className="flex items-center">
												<input
													type="radio"
													name={field.name}
													value={option}
													checked={field.state.value === option}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
												/>
												<span className="ml-2 text-gray-700 dark:text-gray-300 capitalize">
													{option.replace('-', ' ')}
												</span>
											</label>
										),
									)}
								</div>
								{getErrorMessage(field.state.meta.errors) && (
									<p className="mt-1 text-sm text-red-500">
										{getErrorMessage(field.state.meta.errors)}
									</p>
								)}
							</div>
						)}
					/>

					{/* Checkboxes */}
					<div className="space-y-3">
						<form.Field
							name="newsletter"
							children={(field) => (
								<label className="flex items-start">
									<input
										type="checkbox"
										name={field.name}
										checked={field.state.value}
										onChange={(e) => field.handleChange(e.target.checked)}
										className="mt-1 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 rounded"
									/>
									<span className="ml-2 text-gray-700 dark:text-gray-300">
										Subscribe to newsletter
									</span>
								</label>
							)}
						/>

						<form.Field
							name="terms"
							children={(field) => (
								<div>
									<label className="flex items-start">
										<input
											type="checkbox"
											name={field.name}
											checked={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.checked)}
											className="mt-1 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 rounded"
										/>
										<span className="ml-2 text-gray-700 dark:text-gray-300">
											I accept the terms and conditions{' '}
											<span className="text-red-500">*</span>
										</span>
									</label>
									{getErrorMessage(field.state.meta.errors) && (
										<p className="mt-1 text-sm text-red-500">
											{getErrorMessage(field.state.meta.errors)}
										</p>
									)}
								</div>
							)}
						/>
					</div>

					{/* Submit Button */}
					<div className="pt-4 border-t border-gray-200 dark:border-gray-700">
						<form.Subscribe
							selector={(state) => ({
								canSubmit: state.canSubmit,
								isSubmitting: state.isSubmitting,
							})}
							children={(state) => (
								<button
									type="submit"
									disabled={!state.canSubmit}
									className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
								>
									{state.isSubmitting ? 'Submitting...' : 'Submit Form'}
								</button>
							)}
						/>
					</div>
				</form>

				{/* Form State Preview */}
				<div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
					<h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
						Current Form State:
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

				{/* Form Validation State */}
				<div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
					<h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
						Form Validation State:
					</h3>
					<form.Subscribe
						selector={(state) => ({
							canSubmit: state.canSubmit,
							isSubmitting: state.isSubmitting,
							isPristine: state.isPristine,
							isValid: state.isValid,
						})}
						children={(state) => (
							<div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
								<p>Can Submit: {state.canSubmit ? '✅' : '❌'}</p>
								<p>Is Submitting: {state.isSubmitting ? '✅' : '❌'}</p>
								<p>Is Pristine: {state.isPristine ? '✅' : '❌'}</p>
								<p>Is Valid: {state.isValid ? '✅' : '❌'}</p>
							</div>
						)}
					/>
				</div>
			</div>
		</div>
	);
};

export default FormDemoPage;
