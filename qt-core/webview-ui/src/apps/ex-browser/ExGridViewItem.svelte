<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { Tag } from '@/icons';
  import { type ExEntry } from '@shared/ex-browser';
  import ExThumbnail from './ExThumbnail.svelte';
  import { ui } from './states.svelte';
  import * as viewlogic from './viewlogic.svelte';

  let {
    example = undefined as ExEntry | undefined,
  } = $props();

  function onClicked() {
    viewlogic.selectExample(example);
  }

  function addSpaceBeforeUppercase(str: string): string {
    // 'QtQuickControls' => 'Qt Quick Controls'
    // 'QMLTestRunner' => 'QML Test Runner'
    return str
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
  }
</script>

<button
  class='w-full h-full group'
  onclick={onClicked}
>
  {#if example}
    <div
      class='card w-full h-full flex flex-col relative'
      class:selected={example === ui.selected.example}
    >
      <div class='thumbnail'><ExThumbnail {example} /></div>
      <div class='
        qt-badge app-card-badge
        absolute top-[8px] left-[8px]
      '>
        {addSpaceBeforeUppercase(example.module)}
      </div>
      <div class='card-title'>{example.name}</div>
      <div class='qt-separator'></div>
      <div class='card-tags-container'>
        <div class='card-tag-icon'>
          <Tag size={20}/>
        </div>

        {#each example?.tags as tag (tag)}
          <div class='qt-badge app-tag-badge'>{tag}</div>
        {/each}
      </div>
    </div>
  {/if}
</button>

<style>
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(3px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .card {
    min-height: 220px;
    padding: var(--qt-spacing-xl);
    gap: var(--qt-spacing-m);

    background: var(--qt-bg-elevated);
    border: 1px solid var(--qt-stroke-subtle);
    border-radius: var(--qt-radius-s);

    cursor: pointer;
    overflow: hidden;

    animation: cardIn 160ms ease both;
    transition: border-color 120ms, background 120ms;
  }

  .card:hover {
    background: var(--qt-hover-bg);
    border-color: var(--qt-stroke-muted);
  }

  .card.selected {
    background: rgba(0,122,204,0.09);
    border-color: var(--qt-accent-info);
  }

  .thumbnail {
    flex: 1;
    min-height: 110px;
    background: var(--qt-bg-default);
    overflow: hidden;
  }

  .card-title {
    font-size: 13px;
    font-weight: 500;
    color: var(--qt-text-default);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 18px;
    text-align: start;
  }

  .tags-container {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    flex-wrap: nowrap;
    overflow: hidden;
    min-height: 20px;
  }

  .tag-icon {
    font-size: 14px;
    color: var(--qt-text-muted);
    flex-shrink: 0;
    line-height: 1;
    display: flex;
    align-items: center;
    margin-right: 1px;
    opacity: 0.7;
  }
</style>
