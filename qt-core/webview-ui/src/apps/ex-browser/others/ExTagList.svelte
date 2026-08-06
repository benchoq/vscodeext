<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { Tag } from '@/icons';
  import ExTagChip from './ExTagChip.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  let {
    tags = [] as string[],
    usage = 'card' as 'header' | 'card' | 'list' | 'details',
  } = $props();
</script>

<div
  data-comp='tag-list'
  data-comp-root
  class='flex flex-row'
  class:flex-wrap={usage === 'details'}
>
  {#if usage === 'card' || usage === 'list'}
    <div data-role='icon'>
      <Tag size={usage === 'card' ? 20 : 13}/>
    </div>
  {/if}

  {#if tags.length}
    {#each tags as tag (tag)}
      <ExTagChip
        text={tag}
        outline={usage === 'details'}
        selected={viewlogic.isTagSelected(tag)}
        decorated={usage === 'header'}
        onClicked={(e: MouseEvent) => {
          e.stopPropagation();
          viewlogic.toggleTag(tag);
        }}
      />
    {/each}
  {:else}
    <span data-role='no-tags'>No tags</span>
  {/if}
</div>

<style>
  [data-comp-root] {
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    overflow: hidden;
    min-height: 20px;
  }

  [data-role='no-tags'] {
    color: var(--qt-text-muted);
  }

  [data-role='icon'] {
    color: var(--qt-text-muted);
    flex-shrink: 0;
    align-items: center;
    margin-right: 1px;
    opacity: 0.7;
  }
</style>
