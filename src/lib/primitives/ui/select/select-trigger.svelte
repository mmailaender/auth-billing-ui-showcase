<script lang="ts">
	import { Select, type SelectTriggerProps } from '@ark-ui/svelte/select';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { cn, type WithoutChild } from '../../utils.js';

	let {
		ref = $bindable(null),
		class: className,
		size = 'default',
		placeholder,
		...restProps
	}: WithoutChild<SelectTriggerProps> & {
		size?: 'sm' | 'default';
		placeholder?: string;
	} = $props();
</script>

<Select.Control>
	<Select.Trigger
		bind:ref
		data-slot="select-trigger"
		data-size={size}
		class={cn(
			"flex w-fit items-center justify-between gap-2 rounded-base border border-surface-400-600 bg-transparent px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none select-none hover:border-surface-500 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[placeholder]:text-muted-foreground data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
			className
		)}
		{...restProps}
	>
		<Select.ValueText {placeholder} />
		<Select.Indicator>
			<ChevronDownIcon class="size-4" />
		</Select.Indicator>
	</Select.Trigger>
</Select.Control>
