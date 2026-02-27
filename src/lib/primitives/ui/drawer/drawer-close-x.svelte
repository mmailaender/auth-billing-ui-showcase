<script lang="ts">
	import { XIcon } from '@lucide/svelte';
	import {
		DialogCloseTrigger as ArkDialogCloseTrigger,
		type DialogCloseTriggerProps
	} from '@ark-ui/svelte/dialog';

	let { ref = $bindable(null), ...restProps }: DialogCloseTriggerProps = $props();
</script>

<ArkDialogCloseTrigger
	bind:ref
	data-scope="drawer"
	class="absolute top-4 right-4 rounded-base p-2 opacity-70 ring-offset-background transition-opacity hover:bg-surface-300-700 hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
	type="button"
	{...restProps}
>
	<XIcon />
	<span class="sr-only">Close</span>
</ArkDialogCloseTrigger>
