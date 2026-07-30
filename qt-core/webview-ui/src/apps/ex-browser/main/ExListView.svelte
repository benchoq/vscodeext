<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { type ExEntry } from '@shared/ex-browser';

  import ExTagsList from '../others/ExTagsList.svelte';
  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  let {
    examples = [] as ExEntry[],
  } = $props();

</script>

<div data-comp-root class='flex flex-col'>
  {#each examples as example (example)}
    <button
      data-item
      class:selected={example === ui.selected.example}
      onclick={() => {
        viewlogic.selectExample(example);
      }}
    >
      <div data-title>{example.name}</div>
      <ExTagsList tags={example?.tags ?? []} />
      <div class='grow'></div>
      <div data-category>{example.categories.join(', ')}</div>
    </button>
  {/each}
</div>

<style>
  [data-comp-root] {
    gap: 2px;

    & > [data-item] {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 10px;
      height: 36px;
      border-radius: var(--qt-radius-s);
      border: 1px solid var(--qt-stroke-subtle);
      cursor: pointer;
      background: var(--qt-bg-elevated);
      transition-property: border-color, background;
      transition-duration: var(--duration-base);

      &:hover {
        border-color: var(--qt-stroke-muted);
        background: var(--qt-hover-bg);
      }

      &.selected {
        border-color: var(--qt-accent-info);
        background: rgba(0,122,204,0.09);
      }

      & > [data-title] {
        flex-shrink: 1;
        font-size: 13px;
        font-weight: 500;
        color: var(--qt-text-default);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      & > [data-category] {
        margin-left: auto;
        flex-shrink: 0;
        font-size: 10px;
        font-weight: 600;
        color: var(--qt-text-muted);
        white-space: nowrap;
        opacity: 0.8;
      }
    }
  }
</style>
