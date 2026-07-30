<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { type Snippet } from 'svelte';
  import ChevronRight from '@/icons/ChevronRight.svelte';

  let {
    title = '',
    count = 0,
    expanded = $bindable(true),
    children = undefined as (Snippet | undefined)
  } = $props();
</script>

<div data-comp-root class="flex flex-col">
  <button
    data-header
    class='flex flex-row'
    onclick={() => {
      expanded = !expanded;
    }}
  >
    <span
      data-chevron
      style:transform={expanded ? 'rotate(90deg)' : 'rotate(0deg)'}
    >
      <ChevronRight size={16} />
    </span>
    <span data-text>{title}</span>
    <span data-count>{count}</span>
  </button>

  {#if expanded}
    {@render children?.()}
  {/if}
</div>

<style>
  [data-comp-root] {
    gap: 10px;
  }

  [data-header] {
    top: 0;
    position: sticky;
    z-index: 1;
    padding: 5px 0px;
    margin-top: 16px;

    color: var(--qt-text-muted);
    background: var(--qt-bg-default);
    border-bottom: 1px solid var(--qt-stroke-subtle);

    gap: 7px;
    align-items: center;
    user-select: none;
    cursor: pointer;

    & > [data-chevron] {
      transition: transform 150ms;
    }

    & > [data-text] {
      flex: 1;
      font-size: 11px;
      font-weight: 600;
      text-align: start;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    &:hover [data-text] {
      color: var(--qt-text-default);
    }

    & > [data-count] {
      font-size: 10px;
      font-variant-numeric: tabular-nums;
    }
  }
</style>
