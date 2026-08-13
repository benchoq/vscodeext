<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from '../states.svelte';
  import { clickOutside, portal, placeNear } from '@/utils/actions';
  import ExTagsPopover from './popovers/ExTagsPopover.svelte';

  let popover = $state({
    visible: false,
    reference: undefined as HTMLButtonElement | undefined
  });
</script>

<button
  bind:this={popover.reference}
  class='qt-button flex flex-row'
  aria-expanded={popover.visible}
  disabled={(ui.filter.category?.tags.length ?? 0) === 0}
  onclick={(e: MouseEvent) => {
    popover.visible = !popover.visible;
    e.stopPropagation();
  }}
>
  <span># Tags</span>
  <span class='qt-badge'>
    {(ui.filter.category?.tags.length ?? 0).toString()}
  </span>
</button>

{#if popover.visible}
  <div
    use:portal
    use:placeNear={{
      ref: popover.reference,
      placement: 'bottom-start',
      offset: 5
    }}
    use:clickOutside={(e: MouseEvent) => {
      popover.visible = false;
      e.stopPropagation();
    }}
    class='fixed z-2'
  >
    <ExTagsPopover />
  </div>
{/if}

<style>
  .qt-button {
    height: 28px;
    color: var(--qt-text-muted);
    border-radius: var(--qt-radius-s);
    text-overflow: unset;

    &[aria-expanded='true'] {
      border-color: var(--qt-accent-info);
    }
  }
</style>
