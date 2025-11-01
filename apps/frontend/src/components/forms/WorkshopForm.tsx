/**
 * Workshop Event Form
 * Demonstrates form composition by reusing the same shared blocks as ConferenceForm
 * but with different workshop-specific fields
 */

import { toast } from '@components/ToastContainer';
import { useAppForm } from '@lib/form-composition';
import { createFieldMap } from '@tanstack/react-form';
import { getErrorMessage } from '@utils/form';
import { z } from 'zod';
import {
	DateTimeBlock,
	dateTimeDefaults,
	dateTimeSchema,
} from './blocks/DateTimeBlock';
import {
	LocationBlock,
	locationDefaults,
	locationSchema,
} from './blocks/LocationBlock';
import {
	PricingBlock,
	pricingDefaults,
	pricingSchema,
} from './blocks/PricingBlock';

// Workshop-specific fields schema
const workshopSpecificSchema = z.object({
	workshopName: z
		.string()
		.min(3, 'Workshop name must be at least 3 characters'),
	description: z.string().min(10, 'Description must be at least 10 characters'),
	skillLevel: z.enum(['beginner', 'intermediate', 'advanced']),
	maxParticipants: z
		.number()
		.min(5, 'Must have at least 5 participants')
		.max(100, 'Max 100 participants'),
	materialsProvided: z.boolean(),
	prerequisites: z.string(),
});

// Combined form schema using the shared block schemas
const workshopFormSchema = z.object({
	workshopName: workshopSpecificSchema.shape.workshopName,
	description: workshopSpecificSchema.shape.description,
	skillLevel: workshopSpecificSchema.shape.skillLevel,
	maxParticipants: workshopSpecificSchema.shape.maxParticipants,
	materialsProvided: workshopSpecificSchema.shape.materialsProvided,
	prerequisites: workshopSpecificSchema.shape.prerequisites,
	// Shared block fields
	...dateTimeSchema.shape,
	...locationSchema.shape,
	...pricingSchema.shape,
});

// Infer TypeScript type from Zod schema
type WorkshopFormValues = z.infer<typeof workshopFormSchema>;

const defaultValues: WorkshopFormValues = {
	workshopName: '',
	description: '',
	skillLevel: 'beginner',
	maxParticipants: 20,
	materialsProvided: false,
	prerequisites: '',
	...dateTimeDefaults,
	...locationDefaults,
	...pricingDefaults,
};

export const WorkshopForm = () => {
	const form = useAppForm({
		defaultValues,
		validators: {
			onChange: workshopFormSchema,
		},
		onSubmit: async ({ value }) => {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			console.log('Workshop form submitted:', value);
			toast.success('Workshop created successfully!');
		},
	});

	// Create field maps for the reusable blocks
	const dateTimeFields = createFieldMap(dateTimeDefaults);
	const locationFields = createFieldMap(locationDefaults);
	const pricingFields = createFieldMap(pricingDefaults);

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
			<h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
				Create Workshop Event
			</h2>
			<p className="text-gray-600 dark:text-gray-400 mb-6">
				Hands-on workshop with skill-based learning and materials
			</p>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-8"
			>
				{/* Workshop-Specific Fields */}
				<div className="space-y-4">
					<div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
							Workshop Details
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Basic information about your workshop
						</p>
					</div>

					{/* Workshop Name */}
					<form.Field
						name="workshopName"
						children={(field) => (
							<div>
								<label
									htmlFor={field.name}
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>
									Workshop Name <span className="text-red-500">*</span>
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
									placeholder="React Advanced Patterns Workshop"
								/>
								{getErrorMessage(field.state.meta.errors) && (
									<p className="mt-1 text-sm text-red-500">
										{getErrorMessage(field.state.meta.errors)}
									</p>
								)}
							</div>
						)}
					/>

					{/* Description */}
					<form.Field
						name="description"
						children={(field) => (
							<div>
								<label
									htmlFor={field.name}
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>
									Description <span className="text-red-500">*</span>
								</label>
								<textarea
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									rows={4}
									className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
										${
											getErrorMessage(field.state.meta.errors)
												? 'border-red-500 focus:ring-red-500'
												: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
										}
										dark:bg-gray-700 dark:text-white resize-none`}
									placeholder="Learn advanced React patterns through hands-on exercises..."
								/>
								{getErrorMessage(field.state.meta.errors) && (
									<p className="mt-1 text-sm text-red-500">
										{getErrorMessage(field.state.meta.errors)}
									</p>
								)}
							</div>
						)}
					/>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Skill Level */}
						<form.Field
							name="skillLevel"
							children={(field) => (
								<div>
									<label
										htmlFor={field.name}
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										Skill Level <span className="text-red-500">*</span>
									</label>
									<select
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) =>
											field.handleChange(
												e.target.value as
													| 'beginner'
													| 'intermediate'
													| 'advanced',
											)
										}
										className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
											${
												getErrorMessage(field.state.meta.errors)
													? 'border-red-500 focus:ring-red-500'
													: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
											}
											dark:bg-gray-700 dark:text-white`}
									>
										<option value="beginner">Beginner</option>
										<option value="intermediate">Intermediate</option>
										<option value="advanced">Advanced</option>
									</select>
									{getErrorMessage(field.state.meta.errors) && (
										<p className="mt-1 text-sm text-red-500">
											{getErrorMessage(field.state.meta.errors)}
										</p>
									)}
								</div>
							)}
						/>

						{/* Max Participants */}
						<form.Field
							name="maxParticipants"
							children={(field) => (
								<div>
									<label
										htmlFor={field.name}
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										Max Participants <span className="text-red-500">*</span>
									</label>
									<input
										type="number"
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(Number(e.target.value))}
										min={5}
										max={100}
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
					</div>

					{/* Prerequisites */}
					<form.Field
						name="prerequisites"
						children={(field) => (
							<div>
								<label
									htmlFor={field.name}
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>
									Prerequisites
								</label>
								<textarea
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									rows={2}
									className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors dark:bg-gray-700 dark:text-white resize-none"
									placeholder="Basic knowledge of JavaScript and React hooks..."
								/>
								{getErrorMessage(field.state.meta.errors) && (
									<p className="mt-1 text-sm text-red-500">
										{getErrorMessage(field.state.meta.errors)}
									</p>
								)}
							</div>
						)}
					/>

					{/* Materials Provided Checkbox */}
					<form.Field
						name="materialsProvided"
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
									Materials and equipment will be provided
								</span>
							</label>
						)}
					/>
				</div>

				{/* Shared Form Blocks - Same as ConferenceForm but with different context */}
				<div className="border-t border-gray-200 dark:border-gray-700 pt-6">
					<DateTimeBlock
						form={form}
						fields={dateTimeFields}
						title="Workshop Schedule"
						description="When will your workshop take place?"
					/>
				</div>

				<div className="border-t border-gray-200 dark:border-gray-700 pt-6">
					<LocationBlock
						form={form}
						fields={locationFields}
						title="Workshop Location"
						description="Where will your workshop be held?"
					/>
				</div>

				<div className="border-t border-gray-200 dark:border-gray-700 pt-6">
					<PricingBlock
						form={form}
						fields={pricingFields}
						title="Workshop Pricing"
						description="Configure your workshop ticket pricing"
					/>
				</div>

				{/* Submit Button */}
				<div className="border-t border-gray-200 dark:border-gray-700 pt-6">
					<form.Subscribe
						selector={(state) => ({
							canSubmit: state.canSubmit,
							isSubmitting: state.isSubmitting,
						})}
						children={(state) => (
							<button
								type="submit"
								disabled={!state.canSubmit}
								className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
							>
								{state.isSubmitting
									? 'Creating Workshop...'
									: 'Create Workshop'}
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
