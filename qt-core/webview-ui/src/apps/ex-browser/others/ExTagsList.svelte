<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { Tag } from '@/icons';
  import * as viewlogic from '../viewlogic.svelte';

  let {
    tags = [] as string[],
    size = 20
  } = $props();
</script>

<div data-comp-root class='flex'>
  <div data-icon>
    <Tag {size}/>
  </div>

  {#each tags as tag (tag)}
    <button
      data-text
      class:selected={viewlogic.hasTagInQuery(tag)}
      onclick={(e: MouseEvent) => {
        e.stopPropagation();
        viewlogic.toggleTagInQuery(tag);
      }}
    >
      {tag}
    </button>
  {/each}
</div>

<style>
  [data-comp-root] {
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    flex-wrap: nowrap;
    overflow: hidden;
    min-height: 20px;

    & > [data-icon] {
      font-size: 14px;
      color: var(--qt-text-muted);
      flex-shrink: 0;
      line-height: 1;
      display: flex;
      align-items: center;
      margin-right: 1px;
      opacity: 0.7;
    }

    & > [data-text] {
      display: inline-flex;
      align-items: center;
      height: 20px;
      padding: 0 6px;
      border-radius: var(--qt-radius-s);
      background: var(--qt-bg-input);
      color: var(--qt-text-muted);
      border: 1px solid transparent;
      font-size: 10px;
      font-weight: 600;
      line-height: 12px;
      letter-spacing: 0;
      white-space: nowrap;
      cursor: pointer;
      font-family: inherit;
      transition-property: background, border-color, color;
      transition-duration: var(--duration-short);
      text-decoration: none;

      &:hover {
        background: var(--qt-hover-bg);
        color: var(--qt-text-default);
      }

      &.selected {
        background: var(--accent-blue-a22);
        border-color: var(--accent-blue-a55);
        color: var(--qt-accent-active);
      }
    }
  }
</style>
