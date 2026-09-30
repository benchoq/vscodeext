<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang='ts'>
  import { ArrowLeft } from '@lucide/svelte';
  import Separator from '@/comps/Separator.svelte';
  import { ui } from './states.svelte';
  import * as viewlogic from './viewlogic.svelte';

  const items = [
    { id: 'back', label: 'Back', icon: ArrowLeft },
    { id: 'forward', label: 'Forward' },
    { id: '' },
    { id: 'copy', label: 'Copy'}
  ]

  function onClicked(id: string) {
    switch (id) {
      case 'back':
        viewlogic.navigate('back');
        break;

      case 'forward':
        viewlogic.navigate('forward');
        break;

      case 'copy':
        viewlogic.copySelection();
        break;

      default:
        return;
    }

    ui.popovers.contextMenu.visible = false;
  }

  function isEnabled(id: string) {
    switch (id) {
      case 'back':
        return ui.history.canGo('back');

      case 'forward':
        return ui.history.canGo('forward');

      case 'copy':
        return true;

      default:
        return false;
    }
  }

</script>

<div class="qt-popover min-w-[150px]">
  <div class="qt-item-list flex flex-col">
    {#each items as item, i (i)}
      {#if item.id.length === 0}
        <Separator />
      {:else}
        <button
          class='item flex flex-row items-center gap-2'
          disabled={!isEnabled(item.id)}
          onclick={() => { onClicked(item.id); }}
        >
          {#if item.icon}
            <item.icon size='20px'/>
          {/if}

          {item.label}
        </button>
      {/if}
    {/each}
  </div>
</div>

<style>
  .qt-item-list .item {
    padding: 6px 10px;

    &:hover:enabled {
      background: var(--qt-accent-info);
      color: var(--qt-button-fg);
    }
  }
</style>
