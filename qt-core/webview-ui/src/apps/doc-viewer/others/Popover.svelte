<!-- Popup.svelte -->
<script lang="ts">
  import { type Snippet } from 'svelte';
  import { type Placement, type ReferenceElement } from '@floating-ui/dom';
  import { clickOutside, portal, placeNear } from '@/utils/actions';

  interface Props {
    reference?: ReferenceElement;
    placement?: Placement;
    offset?: number;
    onClose?: (e: MouseEvent) => void;
    children: Snippet;
  }

  let {
    reference,
    placement = 'bottom-start',
    offset = 0,
    onClose,
    children,
  }: Props = $props();

  function handleClickOutside(e: MouseEvent) {
    onClose?.(e);
    e.stopPropagation();
  }
</script>

<div
  use:portal
  use:placeNear={{ ref: reference, placement, offset }}
  use:clickOutside={handleClickOutside}
  class="z-1"
>
  {@render children()}
</div>
