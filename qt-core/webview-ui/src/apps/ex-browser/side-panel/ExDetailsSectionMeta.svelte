<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from '../states.svelte';

  const example = $derived(ui.selected.example);
</script>

<div class='grid grid-cols-[max-content_1fr]'>
  <div class='detail-title detail-separator'>Qt</div>
  <div class='detail-value detail-separator'>{ui.selected.package?.name}</div>

  <div class='detail-title detail-separator'>Category</div>
  <div class='detail-value detail-separator'>
    {#each example?.categories as cat (cat)}
      <div>{cat}</div>
    {/each}
  </div>

  <div class='detail-title detail-separator'>Module</div>
  <div class='detail-value detail-separator'>{example?.module ?? ''}</div>

  <div class='detail-title detail-separator'>Tag</div>
  <div class='detail-value detail-separator'>
    {#if (example?.tags.length ?? 0) === 0}
      <div class='empty-value'>
        No tags
      </div>
    {:else}
      <div class='flex flex-wrap gap-x-2'>
        {#each example?.tags as tag (tag)}
          <div>{tag}</div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  :global(.detail-title) {
    padding: 3px 0px;
    font-size: 11px;
    font-weight: 500;
    color: var(--qt-text-muted);
    min-width: 60px;
    flex-shrink: 0;
    line-height: 18px;
  }

  :global(.detail-value) {
    padding: 3px 0px;
    font-size: 11px;
    color: var(--qt-text-default);
    line-height: 18px;
    word-break: break-word;
  }

  :global(.detail-separator) {
    border-bottom: 1px solid var(--qt-stroke-subtle);
  }
</style>
