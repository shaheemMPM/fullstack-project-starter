/**
 * Form Demo Page - Demonstrates TanStack Form v1 composition
 * Shows how to build reusable form blocks and compose them into different forms
 */

import { ConferenceForm } from '@components/forms/ConferenceForm';
import { WorkshopForm } from '@components/forms/WorkshopForm';
import { useState } from 'react';

type TabType = 'conference' | 'workshop';

const FormDemoPage = () => {
	const [activeTab, setActiveTab] = useState<TabType>('conference');

	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-8">
				<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
					Form Composition Demo
				</h1>
				<p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
					TanStack Form v1 with reusable form blocks
				</p>
				<div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
					<p>
						This demo showcases{' '}
						<span className="font-semibold text-gray-900 dark:text-white">
							form composition
						</span>{' '}
						- the ability to create reusable form blocks that can be shared
						across multiple forms.
					</p>
					<p>
						Both forms below share the same{' '}
						<span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
							DateTimeBlock
						</span>
						,{' '}
						<span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
							LocationBlock
						</span>
						, and{' '}
						<span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
							PricingBlock
						</span>{' '}
						components, but have different form-specific fields. This pattern
						makes it easy to maintain consistent validation and UX across your
						application.
					</p>
				</div>
			</div>

			{/* Tabs */}
			<div className="border-b border-gray-200 dark:border-gray-700 mb-6">
				<nav className="flex space-x-4">
					<button
						type="button"
						onClick={() => setActiveTab('conference')}
						className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
							activeTab === 'conference'
								? 'border-blue-600 text-blue-600 dark:text-blue-400'
								: 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300'
						}`}
					>
						Conference Event
					</button>
					<button
						type="button"
						onClick={() => setActiveTab('workshop')}
						className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
							activeTab === 'workshop'
								? 'border-green-600 text-green-600 dark:text-green-400'
								: 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300'
						}`}
					>
						Workshop Event
					</button>
				</nav>
			</div>

			{/* Tab Content */}
			<div>
				{activeTab === 'conference' && <ConferenceForm />}
				{activeTab === 'workshop' && <WorkshopForm />}
			</div>

			{/* Technical Details */}
			<div className="mt-12 bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
				<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
					Technical Implementation
				</h2>
				<div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
					<div>
						<h3 className="font-semibold text-gray-900 dark:text-white mb-2">
							Form Composition Pattern
						</h3>
						<p>
							This demo uses TanStack Form v1's{' '}
							<code className="font-mono bg-white dark:bg-gray-800 px-2 py-0.5 rounded">
								withFieldGroup
							</code>{' '}
							API to create reusable form blocks. Each block is a self-contained
							component with its own validation, default values, and UI.
						</p>
					</div>

					<div>
						<h3 className="font-semibold text-gray-900 dark:text-white mb-2">
							Shared Form Blocks
						</h3>
						<ul className="list-disc list-inside space-y-1 ml-2">
							<li>
								<strong>DateTimeBlock:</strong> Start/end date and time fields
							</li>
							<li>
								<strong>LocationBlock:</strong> Venue name, address, city,
								country, and capacity
							</li>
							<li>
								<strong>PricingBlock:</strong> Conditional pricing with free,
								fixed, and tiered options
							</li>
						</ul>
					</div>

					<div>
						<h3 className="font-semibold text-gray-900 dark:text-white mb-2">
							Form-Specific Fields
						</h3>
						<ul className="list-disc list-inside space-y-1 ml-2">
							<li>
								<strong>Conference:</strong> Conference name, description,
								number of tracks, keynote count
							</li>
							<li>
								<strong>Workshop:</strong> Workshop name, description, skill
								level, max participants, materials provided, prerequisites
							</li>
						</ul>
					</div>

					<div>
						<h3 className="font-semibold text-gray-900 dark:text-white mb-2">
							Validation Strategy
						</h3>
						<p>
							Each form block defines its own Zod schema. The parent forms
							combine these schemas with their form-specific validation,
							creating a complete type-safe validation layer. This modular
							approach makes validation rules easy to maintain and reuse.
						</p>
					</div>

					<div>
						<h3 className="font-semibold text-gray-900 dark:text-white mb-2">
							Files Structure
						</h3>
						<pre className="font-mono text-xs bg-white dark:bg-gray-800 p-3 rounded overflow-x-auto">
							{`src/
├── lib/
│   └── form-composition.tsx           # Form contexts & hooks
├── components/forms/
│   ├── blocks/                        # Reusable form blocks
│   │   ├── DateTimeBlock.tsx          # Date/time fields
│   │   ├── LocationBlock.tsx          # Location fields
│   │   └── PricingBlock.tsx           # Pricing fields
│   ├── ConferenceForm.tsx             # Conference form
│   └── WorkshopForm.tsx               # Workshop form
└── utils/
    └── form.ts                         # Form utility functions`}
						</pre>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FormDemoPage;
