<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { type ExEntry } from '@shared/ex-browser';
  import * as utils from '@/utils/utils';

  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';
  import ExTagList from '../others/ExTagList.svelte';
  import ExThumbnail from '../others/ExThumbnail.svelte';
  import ExSeparator from '../others/ExSeparator.svelte';

  type Props = { example: ExEntry };
  let { example }: Props = $props();

  function selectExample() {
    viewlogic.selectExample(example);
  }
</script>

<div
  data-root
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
  <div data-role='card-module' class='absolute'>
    {utils.addSpaceBeforeUppercase(example.module)}
  </div>
  <div data-role='card-name'>{example.name}</div>
  <ExSeparator />
  <ExTagList
    usage='card'
    tags={example.tags}
  />
</div>

<style>
  [data-root] {
    padding: var(--qt-spacing-xl);
    background: var(--qt-bg-elevated);
    border: 1px solid var(--qt-stroke-subtle);
    border-radius: var(--qt-radius-s);
    gap: var(--qt-spacing-m);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition-property: background, border-color;
    transition-duration: var(--duration-long);
    animation: cardInAni 160ms ease both;

    &:hover {
      background: var(--qt-hover-bg);
      border-color: color-mix(in srgb, var(--qt-text-muted) 60%, transparent);
    }

    &.selected {
      background: var(--accent-blue-a9);
      border-color: var(--qt-accent-info);
    }

    & > [data-thumbnail] {
      flex: 1;
      min-height: 110px;
      background: var(--qt-bg-default);
      overflow: hidden;
    }
  }

  [data-role='card-name'] {
    color: var(--qt-text-default);
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  [data-role='card-module'] {
    top: 8px;
    left: 8px;
    padding: 0 6px;
    color: #f2f2f2;
    background: rgba(0,0,0,0.62);
    border-radius: 3px;

    font-size: 9px;
    font-weight: 600;
    line-height: 16px;
    letter-spacing: 0.02em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }

  @keyframes cardInAni {
    from { opacity: 0; transform: translateY(3px); }
    to   { opacity: 1; transform: translateY(0); }
  }
</style>
