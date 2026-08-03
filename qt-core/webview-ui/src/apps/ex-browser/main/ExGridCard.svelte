<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { type ExEntry } from '@shared/ex-browser';
  import * as utils from '@/utils/utils';

  import ExTagList from '../others/ExTagList.svelte';
  import ExThumbnail from '../others/ExThumbnail.svelte';
  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  let {
    example
  } : {
    example: ExEntry
  } = $props();

  function selectExample() {
    viewlogic.selectExample(example);
  }
</script>

<div
  data-comp-root
  class='w-full h-full flex flex-col relative'
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
  <div data-module-tag class='absolute'>
    {utils.addSpaceBeforeUppercase(example.module)}
  </div>
  <div data-name>{example.name}</div>
  <div class='qt-separator'></div>
  <ExTagList
    usage='card'
    tags={example.tags}
  />
</div>

<style>
  [data-comp-root] {
    background: var(--qt-bg-elevated);
    border: 1px solid var(--qt-stroke-subtle);
    border-radius: var(--qt-radius-s);
    padding: var(--qt-spacing-xl);
    gap: var(--qt-spacing-m);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition-property: background, border-color;
    transition-duration: var(--duration-long);
    min-height: var(--card-min-height);
    animation: cardInAni 160ms ease both;

    &:hover {
      background: var(--qt-hover-bg);
      border-color: color-mix(in srgb, var(--qt-text-muted) 60%, transparent);
    }

    &.selected {
      background: var(--accent-blue-a9);
      border-color: var(--qt-accent-info);
    }

    & > [data-module-tag] {
      top: 8px;
      left: 8px;
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
      font-size: 13px;
      font-weight: 500;
      color: var(--qt-text-default);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 18px;
    }
  }

  @keyframes cardInAni {
    from { opacity: 0; transform: translateY(3px); }
    to   { opacity: 1; transform: translateY(0); }
  }
</style>
