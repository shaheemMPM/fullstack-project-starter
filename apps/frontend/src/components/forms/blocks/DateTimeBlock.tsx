/**
 * Reusable Date & Time form block
 * Can be composed into any form that needs date/time selection
 */

import { withFieldGroup } from '@lib/form-composition';
import { getErrorMessage } from '@utils/form';
import { z } from 'zod';

// Zod schema for date/time validation
export const dateTimeSchema = z.object({
	startDate: z.string().min(1, 'Start date is required'),
	endDate: z.string().min(1, 'End date is required'),
	startTime: z.string().min(1, 'Start time is required'),
	endTime: z.string().min(1, 'End time is required'),
});

// Default values for the date/time block
export const dateTimeDefaults = {
	startDate: '',
	endDate: '',
	startTime: '',
	endTime: '',
};

export type DateTimeValues = typeof dateTimeDefaults;

/**
 * Reusable Date & Time field group component
 * Can be used in any form that needs date/time configuration
 */
export const DateTimeBlock = withFieldGroup({
	defaultValues: dateTimeDefaults,
	props: {
		title: 'Date & Time',
		description: 'Set the event schedule',
	},
	render: ({ group, title, description }) => {
		return (
			<div className="space-y-4">
				<div>
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						{title}
					</h3>
					<p className="text-sm text-gray-600 dark:text-gray-400">
						{description}
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Start Date */}
					<group.Field
						name="startDate"
						validators={{
							onChange: dateTimeSchema.shape.startDate,
						}}
						children={(field) => (
							<div>
								<label
									htmlFor={field.name}
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>
									Start Date <span className="text-red-500">*</span>
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

					{/* End Date */}
					<group.Field
						name="endDate"
						validators={{
							onChange: dateTimeSchema.shape.endDate,
						}}
						children={(field) => (
							<div>
								<label
									htmlFor={field.name}
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>
									End Date <span className="text-red-500">*</span>
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

					{/* Start Time */}
					<group.Field
						name="startTime"
						validators={{
							onChange: dateTimeSchema.shape.startTime,
						}}
						children={(field) => (
							<div>
								<label
									htmlFor={field.name}
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>
									Start Time <span className="text-red-500">*</span>
								</label>
								<input
									type="time"
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

					{/* End Time */}
					<group.Field
						name="endTime"
						validators={{
							onChange: dateTimeSchema.shape.endTime,
						}}
						children={(field) => (
							<div>
								<label
									htmlFor={field.name}
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>
									End Time <span className="text-red-500">*</span>
								</label>
								<input
									type="time"
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
				</div>
			</div>
		);
	},
});
