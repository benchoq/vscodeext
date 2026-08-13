<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import * as icons from '@/icons';
  import { ui } from '../states.svelte';
</script>

<div data-root class='flex flex-row'>
  {@render ModeButton('grid')}
  {@render ModeButton('list')}
</div>

{#snippet ModeButton(mode: 'grid' | 'list')}
  {@const Comp = mode === 'grid' ? icons.Grid : icons.List}
  <button
    class='qt-button flex items-center justify-center'
    aria-pressed={ui.selected.viewMode === mode}
    onclick={() => {
      ui.selected.viewMode = mode;
    }}
  >
    <Comp />
  </button>
{/snippet}

<style>
  [data-root] {
    border: 1px solid var(--qt-stroke-subtle);
    border-radius: var(--qt-radius-s);
  }

  .qt-button {
    width: 26px;
    height: 26px;
    padding: 0;
    border: none;
    border-radius: 0;
    background: none;

    &:hover {
      color: var(--qt-text-default);
      background: var(--qt-hover-bg);
    }

    &[aria-pressed='true'] {
      color: var(--qt-accent-active);
      background: var(--accent-blue-a15);
    }
  }

  .qt-button + .qt-button {
    border-left: 1px solid var(--qt-stroke-subtle);
  }
</style>

