/**
 * Conference Event Form
 * Demonstrates form composition by combining shared form blocks
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

// Conference-specific fields schema
const conferenceSpecificSchema = z.object({
	conferenceName: z
		.string()
		.min(3, 'Conference name must be at least 3 characters'),
	description: z.string().min(10, 'Description must be at least 10 characters'),
	tracks: z
		.number()
		.min(1, 'Must have at least 1 track')
		.max(10, 'Max 10 tracks'),
	keynoteCount: z
		.number()
		.min(1, 'Must have at least 1 keynote')
		.max(5, 'Max 5 keynotes'),
});

// Combined form schema using the shared block schemas
const conferenceFormSchema = z.object({
	conferenceName: conferenceSpecificSchema.shape.conferenceName,
	description: conferenceSpecificSchema.shape.description,
	tracks: conferenceSpecificSchema.shape.tracks,
	keynoteCount: conferenceSpecificSchema.shape.keynoteCount,
	// Shared block fields
	...dateTimeSchema.shape,
	...locationSchema.shape,
	...pricingSchema.shape,
});

// Infer TypeScript type from Zod schema
type ConferenceFormValues = z.infer<typeof conferenceFormSchema>;

const defaultValues: ConferenceFormValues = {
	conferenceName: '',
	description: '',
	tracks: 2,
	keynoteCount: 2,
	...dateTimeDefaults,
	...locationDefaults,
	...pricingDefaults,
};

export const ConferenceForm = () => {
	const form = useAppForm({
		defaultValues,
		validators: {
			onChange: conferenceFormSchema,
		},
		onSubmit: async ({ value }) => {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			console.log('Conference form submitted:', value);
			toast.success('Conference created successfully!');
		},
	});

	// Create field maps for the reusable blocks
	const dateTimeFields = createFieldMap(dateTimeDefaults);
	const locationFields = createFieldMap(locationDefaults);
	const pricingFields = createFieldMap(pricingDefaults);

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
			<h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
				Create Conference Event
			</h2>
			<p className="text-gray-600 dark:text-gray-400 mb-6">
				Multi-day conference with tracks, keynotes, and sessions
			</p>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-8"
			>
				{/* Conference-Specific Fields */}
				<div className="space-y-4">
					<div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
							Conference Details
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Basic information about your conference
						</p>
					</div>

					{/* Conference Name */}
					<form.Field
						name="conferenceName"
						children={(field) => (
							<div>
								<label
									htmlFor={field.name}
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>
									Conference Name <span className="text-red-500">*</span>
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
									placeholder="Tech Summit 2025"
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
									placeholder="A three-day conference featuring the latest in technology..."
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
						{/* Number of Tracks */}
						<form.Field
							name="tracks"
							children={(field) => (
								<div>
									<label
										htmlFor={field.name}
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										Number of Tracks <span className="text-red-500">*</span>
									</label>
									<input
										type="number"
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(Number(e.target.value))}
										min={1}
										max={10}
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

						{/* Number of Keynotes */}
						<form.Field
							name="keynoteCount"
							children={(field) => (
								<div>
									<label
										htmlFor={field.name}
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										Number of Keynotes <span className="text-red-500">*</span>
									</label>
									<input
										type="number"
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(Number(e.target.value))}
										min={1}
										max={5}
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
				</div>

				{/* Shared Form Blocks */}
				<div className="border-t border-gray-200 dark:border-gray-700 pt-6">
					<DateTimeBlock
						form={form}
						fields={dateTimeFields}
						title="Conference Schedule"
						description="Set your conference dates and times"
					/>
				</div>

				<div className="border-t border-gray-200 dark:border-gray-700 pt-6">
					<LocationBlock
						form={form}
						fields={locationFields}
						title="Conference Venue"
						description="Where will your conference be held?"
					/>
				</div>

				<div className="border-t border-gray-200 dark:border-gray-700 pt-6">
					<PricingBlock
						form={form}
						fields={pricingFields}
						title="Ticket Pricing"
						description="Configure your conference ticket pricing"
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
								className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
							>
								{state.isSubmitting
									? 'Creating Conference...'
									: 'Create Conference'}
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
