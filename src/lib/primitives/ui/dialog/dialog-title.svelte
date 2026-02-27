<script lang="ts">
	import { Dialog as ArkDialog, type DialogTitleProps } from '@ark-ui/svelte/dialog';
	import { cn } from '../../utils.js';

	let { ref = $bindable(null), class: className, ...restProps }: DialogTitleProps = $props();
</script>

<ArkDialog.Title
	bind:ref
	data-scope="dialog"
	data-part="title"
	class={cn('text-left h5 leading-none tracking-tight', className)}
	{...restProps}
/>
