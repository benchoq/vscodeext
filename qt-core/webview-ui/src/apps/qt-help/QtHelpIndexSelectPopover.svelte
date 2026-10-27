<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import Popover from '@/comps/Popover.svelte';
  import Separator from '@/comps/Separator.svelte';
  import { ui } from './states.svelte';
  import * as viewlogic from './viewlogic.svelte';

  const letters = $derived.by(() => {
    const alphabet: string[] = [];
    const others: string[] = [];

    for (const s of ui.index.sectionJump) {
      const name = s.name[0];

      if (/^[a-z]$/i.test(name)) {
        alphabet.push(name);
      } else {
        others.push(name);
      }
    }

    return { alphabet, others };
  });

  // const active_lc = $derived(ui.index.section.toLowerCase());
</script>

<Popover
  controller={ui.popovers.indexSelector}
  placement='bottom'
  offset={5}
>
  <div data-role="area" class="qt-popover flex flex-col gap-3">
    <span data-role='guide'>Jump to:</span>
    {@render sectionGrid(letters.alphabet)}
    <Separator />
    {@render sectionGrid(letters.others)}
  </div>
</Popover>

<!-- snippets -->
{#snippet sectionGrid(sections: string[])}
  <div data-role="grid">
    {#each sections as l (l)}
      <button
        data-role="letter"
        class="qt-button"
        // class:active={l.toLowerCase() === active_lc}
        onclick={() => {
          viewlogic.setIndexSectionAndScroll(l);
          ui.popovers.indexSelector.hide();
        }}
      >
        {l}
      </button>
    {/each}
  </div>
{/snippet}

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
    grid-template-columns: repeat(5, 1fr);
    gap: 6px;
  }

  .qt-button[data-role='letter'] {
    width: 36px;
    height: 36px;
    padding: 4px;
    color: var(--qt-text-muted);
    border: none;
    background: color-mix(in srgb, var(--qt-bg-input) 20%, transparent);

    &:hover {
      color: var(--qt-text-default);
      background: var(--qt-hover-bg);
      border: 1px solid var(--qt-stroke-subtle);
    }

    &.active {
      color: var(--qt-selected-fg);
      background: var(--qt-selected-bg);
      border: 1px solid var(--qt-stroke-subtle);
    }
  }
</style>