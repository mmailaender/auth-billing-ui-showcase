<script lang="ts">
	import { AvatarImage as ArkAvatarImage, type AvatarImageProps } from '@ark-ui/svelte';
	import { cn } from '../../utils.js';

	let { class: className, ...restProps }: AvatarImageProps = $props();
</script>

<ArkAvatarImage class={cn('aspect-square size-full', className)} {...restProps} />
