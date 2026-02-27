<script lang="ts">
	import {
		DialogDescription as ArkDialogDescription,
		type DialogDescriptionProps
	} from '@ark-ui/svelte/dialog';
	import { cn } from '../../utils.js';

	let { ref = $bindable(null), class: className, ...restProps }: DialogDescriptionProps = $props();
</script>

<ArkDialogDescription
	bind:ref
	data-scope="drawer"
	class={cn('text-sm text-surface-600-400', className)}
	{...restProps}
/>
