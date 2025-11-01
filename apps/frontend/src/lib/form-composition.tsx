/**
 * Form composition utilities for TanStack Form
 * Creates reusable form contexts and hooks for building modular forms
 */

import { createFormHook, createFormHookContexts } from '@tanstack/react-form';

/**
 * Create shared form and field contexts
 * These contexts enable form composition and reusable form blocks
 */
export const { fieldContext, formContext, useFieldContext, useFormContext } =
	createFormHookContexts();

/**
 * Create a custom form hook with shared contexts
 * This hook is identical to useForm but allows for pre-bound components and field groups
 */
export const { useAppForm, withForm, withFieldGroup } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {},
	formComponents: {},
});
