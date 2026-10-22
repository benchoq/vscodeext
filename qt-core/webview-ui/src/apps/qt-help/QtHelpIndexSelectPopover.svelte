<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import * as viewlogic from './viewlogic.svelte';

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  let {
    active = 'A'
  } = $props();

</script>

<div data-role="area" class="qt-popover flex flex-col gap-3">
  <span data-role='guide'>Select a section to jump to:</span>
  <div data-role="grid">
    {#each letters as l (l)}
      <button
        data-role="letter"
        class="qt-button"
        class:active={l.toLowerCase() === active.toLowerCase()}
        onclick={() => {
          viewlogic.setIndexSectionAndScroll(l);
        }}
      >
        {l}
      </button>
    {/each}
  </div>
</div>

<style>
  [data-role='area'] {
    padding: 10px;
    min-width: 200px;
  }

  [data-role='guide'] {
    color: var(--qt-text-muted);
  }

  [data-role='grid'] {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 6px;
  }

  .qt-button[data-role='letter'] {
    width: 36px;
    height: 36px;
    padding: 5;
    color: var(--qt-text-muted);
    background: var(--qt-bg-default);
    border: 1px solid var(--qt-stroke-subtle);

    &:hover {
      background: var(--qt-hover-bg);
      color: var(--qt-text-default);
    }

    &.active {
      background: var(--qt-selected-bg);
      color: var(--qt-selected-fg);
    }
  }
</style>