/**
 * Reusable Location form block
 * Can be composed into any form that needs location details
 */

import { withFieldGroup } from '@lib/form-composition';
import { getErrorMessage } from '@utils/form';
import { z } from 'zod';

// Zod schema for location validation
export const locationSchema = z.object({
	venueName: z.string().min(1, 'Venue name is required'),
	address: z.string().min(1, 'Address is required'),
	city: z.string().min(1, 'City is required'),
	country: z.string().min(1, 'Country is required'),
	capacity: z.number().min(1, 'Capacity must be at least 1'),
});

// Default values for the location block
export const locationDefaults = {
	venueName: '',
	address: '',
	city: '',
	country: '',
	capacity: 50,
};

export type LocationValues = typeof locationDefaults;

/**
 * Reusable Location field group component
 * Can be used in any form that needs venue/location configuration
 */
export const LocationBlock = withFieldGroup({
	defaultValues: locationDefaults,
	props: {
		title: 'Location',
		description: 'Venue and location details',
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

				{/* Venue Name */}
				<group.Field
					name="venueName"
					validators={{
						onChange: locationSchema.shape.venueName,
					}}
					children={(field) => (
						<div>
							<label
								htmlFor={field.name}
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								Venue Name <span className="text-red-500">*</span>
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
								placeholder="Grand Conference Hall"
							/>
							{getErrorMessage(field.state.meta.errors) && (
								<p className="mt-1 text-sm text-red-500">
									{getErrorMessage(field.state.meta.errors)}
								</p>
							)}
						</div>
					)}
				/>

				{/* Address */}
				<group.Field
					name="address"
					validators={{
						onChange: locationSchema.shape.address,
					}}
					children={(field) => (
						<div>
							<label
								htmlFor={field.name}
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								Address <span className="text-red-500">*</span>
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
								placeholder="123 Main Street"
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
					{/* City */}
					<group.Field
						name="city"
						validators={{
							onChange: locationSchema.shape.city,
						}}
						children={(field) => (
							<div>
								<label
									htmlFor={field.name}
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>
									City <span className="text-red-500">*</span>
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
									placeholder="San Francisco"
								/>
								{getErrorMessage(field.state.meta.errors) && (
									<p className="mt-1 text-sm text-red-500">
										{getErrorMessage(field.state.meta.errors)}
									</p>
								)}
							</div>
						)}
					/>

					{/* Country */}
					<group.Field
						name="country"
						validators={{
							onChange: locationSchema.shape.country,
						}}
						children={(field) => (
							<div>
								<label
									htmlFor={field.name}
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>
									Country <span className="text-red-500">*</span>
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
									placeholder="United States"
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

				{/* Capacity */}
				<group.Field
					name="capacity"
					validators={{
						onChange: locationSchema.shape.capacity,
					}}
					children={(field) => (
						<div>
							<label
								htmlFor={field.name}
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								Max Capacity <span className="text-red-500">*</span>
							</label>
							<input
								type="number"
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(Number(e.target.value))}
								min={1}
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
		);
	},
});
