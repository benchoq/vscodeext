<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { Grid, List } from '@/icons';
  import { ui } from '../states.svelte';
</script>

<div class='qt-button-group flex flex-row'>
  {@render ModeButton('grid')}
  {@render ModeButton('list')}
</div>

<!-- snippets -->
{#snippet ModeButton(mode: 'grid' | 'list')}
  {@const Comp = mode === 'grid' ? Grid : List}
  <button
    class='qt-tool-button'
    aria-pressed={ui.selected.viewMode === mode}
    onclick={() => {
      ui.selected.viewMode = mode;
    }}
  >
    <Comp />
  </button>
{/snippet}
