import { toast } from '@components/ToastContainer';
import { useForm } from '@tanstack/react-form';

interface FormValues {
	username: string;
	email: string;
	age: number;
	birthdate: string;
	bio: string;
	role: string;
	favoriteColor: string;
	gender: string;
	newsletter: boolean;
	terms: boolean;
}

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
		} as FormValues,
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
					Form Demo (TanStack Form)
				</h1>
				<p className="text-gray-600 dark:text-gray-400 mb-8">
					Comprehensive form demo using TanStack Form v1 with various input
					types
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
						validators={{
							onChange: ({ value }) => {
								if (!value) return 'Username is required';
								if (value.length < 3)
									return 'Username must be at least 3 characters';
								return undefined;
							},
						}}
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
											field.state.meta.errors.length > 0
												? 'border-red-500 focus:ring-red-500'
												: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
										}
										dark:bg-gray-700 dark:text-white`}
									placeholder="Enter your username"
								/>
								{field.state.meta.errors.length > 0 && (
									<p className="mt-1 text-sm text-red-500">
										{field.state.meta.errors[0]}
									</p>
								)}
							</div>
						)}
					/>

					{/* Email Input */}
					<form.Field
						name="email"
						validators={{
							onChange: ({ value }) => {
								if (!value) return 'Email is required';
								if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
									return 'Please enter a valid email address';
								}
								return undefined;
							},
						}}
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
											field.state.meta.errors.length > 0
												? 'border-red-500 focus:ring-red-500'
												: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
										}
										dark:bg-gray-700 dark:text-white`}
									placeholder="you@example.com"
								/>
								{field.state.meta.errors.length > 0 && (
									<p className="mt-1 text-sm text-red-500">
										{field.state.meta.errors[0]}
									</p>
								)}
							</div>
						)}
					/>

					{/* Number Input - Age */}
					<form.Field
						name="age"
						validators={{
							onChange: ({ value }) => {
								if (value < 13) return 'You must be at least 13 years old';
								if (value > 120) return 'Please enter a valid age';
								return undefined;
							},
						}}
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
											field.state.meta.errors.length > 0
												? 'border-red-500 focus:ring-red-500'
												: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
										}
										dark:bg-gray-700 dark:text-white`}
								/>
								{field.state.meta.errors.length > 0 && (
									<p className="mt-1 text-sm text-red-500">
										{field.state.meta.errors[0]}
									</p>
								)}
							</div>
						)}
					/>

					{/* Date Input */}
					<form.Field
						name="birthdate"
						validators={{
							onChange: ({ value }) => {
								if (!value) return 'Birthdate is required';
								return undefined;
							},
						}}
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
											field.state.meta.errors.length > 0
												? 'border-red-500 focus:ring-red-500'
												: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
										}
										dark:bg-gray-700 dark:text-white`}
								/>
								{field.state.meta.errors.length > 0 && (
									<p className="mt-1 text-sm text-red-500">
										{field.state.meta.errors[0]}
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
						validators={{
							onChange: ({ value }) => {
								if (!value) return 'Please select a role';
								return undefined;
							},
						}}
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
											field.state.meta.errors.length > 0
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
								{field.state.meta.errors.length > 0 && (
									<p className="mt-1 text-sm text-red-500">
										{field.state.meta.errors[0]}
									</p>
								)}
							</div>
						)}
					/>

					{/* Radio Buttons */}
					<form.Field
						name="gender"
						validators={{
							onChange: ({ value }) => {
								if (!value) return 'Please select a gender';
								return undefined;
							},
						}}
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
								{field.state.meta.errors.length > 0 && (
									<p className="mt-1 text-sm text-red-500">
										{field.state.meta.errors[0]}
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
							validators={{
								onChange: ({ value }) => {
									if (!value) return 'You must accept the terms and conditions';
									return undefined;
								},
							}}
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
									{field.state.meta.errors.length > 0 && (
										<p className="mt-1 text-sm text-red-500">
											{field.state.meta.errors[0]}
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
