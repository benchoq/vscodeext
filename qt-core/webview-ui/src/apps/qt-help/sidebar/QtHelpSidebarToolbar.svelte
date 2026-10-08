<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { type Component } from 'svelte';
  import { Book, ListOrdered, Search } from '@lucide/svelte';

  import * as viewlogic from '../viewlogic.svelte';
  import { ui, type UiMode } from '../states.svelte';

  // const version = $derived(ui.selected.package?.version);
  const version = '6.11.1';

</script>

<div data-area='toolbar' class='flex flex-row gap-2'>
  <button
    bind:this={ui.popovers.qtVersions.refEl}
    class='qt-button flex flex-row !h-full justify-center'
    onclick={(e: MouseEvent) => {
      ui.popovers.qtVersions.visible = !ui.popovers.qtVersions.visible;
      e.stopPropagation();
    }}
  >
    {version ? 'Qt-' + version : '-'}
  </button>


  <div class='flex flex-row gap-0'>
    {@render modeButton('toc', Book)}
    {@render modeButton('text', Search)}
    {@render modeButton('index', ListOrdered)}
  </div>
  <div class='grow'></div>
</div>

{#snippet modeButton(mode: UiMode, Icon: Component)}
  <button
    data-role='mode-button'
    class='qt-button flex flex-row self-center'
    aria-pressed={ui.mode === mode}
    onclick={() => {
      viewlogic.setMode(mode);
    }}
  >
    <div class='flex w-full justify-center align-center self-center'>
      <Icon />
    </div>
  </button>
{/snippet}

<style>
  [data-area='toolbar'] {
    padding: 7px;
    background: var(--qt-bg-subtle);
    border-bottom: 1px solid var(--qt-stroke-subtle);
  }

  .qt-button[data-role='mode-button'] {
    width: 32px;
    height: 100%;

    &:hover {
      color: var(--qt-text-default);
      background: var(--qt-hover-bg);
    }

    &[aria-pressed='true'] {
      color: var(--qt-accent-active);
      background: var(--qt-accent-blue-default);
    }

    &:has(+ &) {
      border-right: none;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    & + & {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
</style>

