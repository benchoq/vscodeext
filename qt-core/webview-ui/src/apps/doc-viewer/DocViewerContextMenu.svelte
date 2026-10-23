<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang='ts'>
  import Popover from '@/comps/Popover.svelte';
  import Separator from '@/comps/Separator.svelte';
  import { ui } from './states.svelte';
  import * as contextMenu from './DocViewerContextMenu';

  $effect(() => {
    const { x, y } = ui.popovers.contextMenu.pos;

    ui.popovers.contextMenu.refEl = {
      getBoundingClientRect: () => {
        return {
          x, y, width: 0, height: 0,
          top: y, right: x, left: x, bottom: y,
        };
      }
    };
  });
</script>

<Popover
  controller={ui.popovers.contextMenu}
  placement='bottom-start'
  offset={5}
>
  <div class="qt-popover min-w-[150px]">
    <div class="qt-item-list flex flex-col">
      {@render content()}
    </div>
  </div>
</Popover>

<!-- snippets -->
{#snippet content()}
  {#each contextMenu.items as item, i (i)}
    {#if item.id.length === 0}
      <Separator />
    {:else}
      <button
        class='item flex flex-row items-center gap-2'
        disabled={!contextMenu.isEnabled(item.id)}
        onclick={() => {
          contextMenu.onClicked(item.id);
          ui.popovers.contextMenu.hide();
        }}
      >
        {#if item.icon}
          <item.icon size='20px'/>
        {/if}

        {item.label}
      </button>
    {/if}
  {/each}
{/snippet}

<style>
  .qt-item-list .item {
    padding: 6px 10px;

    &:hover:enabled {
      background: var(--qt-accent-info);
      color: var(--qt-button-fg);
    }
  }
</style>
