<script lang="ts">
	import { AvatarFallback as ArkAvatarFallback, type AvatarFallbackProps } from '@ark-ui/svelte';
	import { cn } from '../../utils.js';

	let { class: className, ...restProps }: AvatarFallbackProps = $props();
</script>

<ArkAvatarFallback
	class={cn('flex size-full items-center justify-center rounded-full bg-muted', className)}
	{...restProps}
/>
