/**
 * Reusable Pricing form block with conditional pricing options
 * Can be composed into any form that needs pricing configuration
 */

import { withFieldGroup } from '@lib/form-composition';
import { useStore } from '@tanstack/react-store';
import { getErrorMessage } from '@utils/form';
import { z } from 'zod';

// Zod schema for pricing validation
export const pricingSchema = z.object({
	pricingType: z.enum(['free', 'fixed', 'tiered']),
	price: z.number().min(0, 'Price must be non-negative'),
	earlyBirdPrice: z.number().min(0, 'Early bird price must be non-negative'),
	earlyBirdDeadline: z.string(),
});

// Default values for the pricing block
export const pricingDefaults = {
	pricingType: 'free' as 'free' | 'fixed' | 'tiered',
	price: 0,
	earlyBirdPrice: 0,
	earlyBirdDeadline: '',
};

export type PricingValues = typeof pricingDefaults;

/**
 * Reusable Pricing field group component
 * Demonstrates conditional fields based on pricing type selection
 */
export const PricingBlock = withFieldGroup({
	defaultValues: pricingDefaults,
	props: {
		title: 'Pricing',
		description: 'Set ticket pricing and early bird discounts',
	},
	render: ({ group, title, description }) => {
		// Access the current pricing type to show/hide conditional fields
		const pricingType = useStore(
			group.store,
			(state) => state.values.pricingType,
		);

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

				{/* Pricing Type Radio Buttons */}
				<group.Field
					name="pricingType"
					children={(field) => (
						<div>
							<div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Pricing Type <span className="text-red-500">*</span>
							</div>
							<div className="space-y-2">
								{(
									[
										{ value: 'free', label: 'Free Event' },
										{ value: 'fixed', label: 'Fixed Price' },
										{
											value: 'tiered',
											label: 'Tiered Pricing (with Early Bird)',
										},
									] as const
								).map((option) => (
									<label key={option.value} className="flex items-center">
										<input
											type="radio"
											name={field.name}
											value={option.value}
											checked={field.state.value === option.value}
											onBlur={field.handleBlur}
											onChange={() => field.handleChange(option.value)}
											className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
										/>
										<span className="ml-2 text-gray-700 dark:text-gray-300">
											{option.label}
										</span>
									</label>
								))}
							</div>
							{getErrorMessage(field.state.meta.errors) && (
								<p className="mt-1 text-sm text-red-500">
									{getErrorMessage(field.state.meta.errors)}
								</p>
							)}
						</div>
					)}
				/>

				{/* Conditional Fields - Show when not free */}
				{pricingType !== 'free' && (
					<div className="space-y-4 pl-4 border-l-2 border-blue-500">
						{/* Regular Price */}
						<group.Field
							name="price"
							children={(field) => (
								<div>
									<label
										htmlFor={field.name}
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										{pricingType === 'tiered' ? 'Regular Price' : 'Price'}{' '}
										<span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<span className="absolute left-3 top-2.5 text-gray-500">
											$
										</span>
										<input
											type="number"
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) =>
												field.handleChange(Number(e.target.value))
											}
											min={0}
											step={0.01}
											className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
												${
													getErrorMessage(field.state.meta.errors)
														? 'border-red-500 focus:ring-red-500'
														: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
												}
												dark:bg-gray-700 dark:text-white`}
											placeholder="99.00"
										/>
									</div>
									{getErrorMessage(field.state.meta.errors) && (
										<p className="mt-1 text-sm text-red-500">
											{getErrorMessage(field.state.meta.errors)}
										</p>
									)}
								</div>
							)}
						/>

						{/* Early Bird Fields - Show only for tiered pricing */}
						{pricingType === 'tiered' && (
							<>
								<group.Field
									name="earlyBirdPrice"
									children={(field) => (
										<div>
											<label
												htmlFor={field.name}
												className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
											>
												Early Bird Price
											</label>
											<div className="relative">
												<span className="absolute left-3 top-2.5 text-gray-500">
													$
												</span>
												<input
													type="number"
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) =>
														field.handleChange(Number(e.target.value))
													}
													min={0}
													step={0.01}
													className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
														${
															getErrorMessage(field.state.meta.errors)
																? 'border-red-500 focus:ring-red-500'
																: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
														}
														dark:bg-gray-700 dark:text-white`}
													placeholder="79.00"
												/>
											</div>
											{getErrorMessage(field.state.meta.errors) && (
												<p className="mt-1 text-sm text-red-500">
													{getErrorMessage(field.state.meta.errors)}
												</p>
											)}
										</div>
									)}
								/>

								<group.Field
									name="earlyBirdDeadline"
									children={(field) => (
										<div>
											<label
												htmlFor={field.name}
												className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
											>
												Early Bird Deadline
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
							</>
						)}
					</div>
				)}
			</div>
		);
	},
});
