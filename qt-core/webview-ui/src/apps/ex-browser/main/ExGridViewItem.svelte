<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { type ExEntry } from '@shared/ex-browser';
  import ExTagsList from '../others/ExTagsList.svelte';
  import ExThumbnail from '../others/ExThumbnail.svelte';
  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  let {
    example = undefined as ExEntry | undefined,
  } = $props();

  function selectExample() {
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

{#if example}
  <div
    data-comp-card
    class='w-full h-full group flex flex-col relative'
    class:selected={example === ui.selected.example}
    role='button'
    tabindex='0'
    onclick={selectExample}
    onkeydown={(e) => {
      if (e.key === 'Enter') {
        selectExample();
      }
    }}
  >
    <div data-thumbnail><ExThumbnail {example} /></div>
    <div data-module-tag class='absolute top-[8px] left-[8px]'>
      {addSpaceBeforeUppercase(example.module)}
    </div>
    <div data-name>{example.name}</div>
    <div class='qt-separator'></div>
    <ExTagsList tags={example?.tags ?? []} />
  </div>
{/if}

<style>
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(3px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  [data-comp-card] {
    background: var(--qt-bg-elevated);
    border: 1px solid var(--qt-stroke-subtle);
    border-radius: var(--qt-radius-s);
    padding: var(--qt-spacing-xl);
    display: flex;
    flex-direction: column;
    gap: var(--qt-spacing-m);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 120ms, background 120ms;
    min-height: var(--card-min-height);
    animation: cardIn 160ms ease both;

    &:hover {
      background: var(--qt-hover-bg);
      border-color: var(--qt-stroke-muted);
    }

    &.selected {
      background: rgba(0,122,204,0.09);
      border-color: var(--qt-accent-info);
    }

    & > [data-module-tag] {
      height: 16px;
      padding: 0 6px;
      border-radius: 3px;
      background: rgba(0,0,0,0.62);
      color: #f2f2f2;
      font-size: 9px;
      font-weight: 600;
      line-height: 16px;
      letter-spacing: 0.02em;
      white-space: nowrap;
      pointer-events: none;
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      max-width: calc(100% - 16px);
      overflow: hidden;
      text-overflow: ellipsis;
    }

    & > [data-thumbnail] {
      flex: 1;
      min-height: var(--card-thumbnail-min-height);
      background: var(--qt-bg-default);
      overflow: hidden;
    }

    & > [data-name] {
      flex: 1;
      font-size: 13px;
      font-weight: 500;
      color: var(--qt-text-default);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 18px;

      display: flex;
      align-items: center;
      min-height: 20px;
      flex-shrink: 0;
    }
  }
</style>
