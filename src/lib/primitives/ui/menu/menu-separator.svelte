<script lang="ts">
	import { Menu as MenuPrimitive } from '@ark-ui/svelte';
	import { cn } from '../../utils.js';
	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: MenuPrimitive.SeparatorProps = $props();
</script>

<MenuPrimitive.Separator
	bind:ref
	data-slot="menu-separator"
	class={cn('-mx-1 my-1 h-px bg-border', className)}
	{...restProps}
/>
