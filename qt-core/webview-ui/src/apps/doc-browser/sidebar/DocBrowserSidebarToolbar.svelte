<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { type Component } from 'svelte';
  import { Book, ListOrdered, Search } from '@lucide/svelte';

  import * as viewlogic from '../viewlogic.svelte';
  import { ui, type UiMode } from '../states.svelte';
</script>

<div class='flex flex-row h-[32px] gap-2'>
  <button
    class='qt-button flex flex-row'
  >
    Qt 6.11.1
  </button>

  <div class='grow'></div>

  <div class='flex flex-row gap-0'>
    {@render modeButton('toc', Book)}
    {@render modeButton('index', ListOrdered)}
    {@render modeButton('text', Search)}
  </div>
</div>

{#snippet modeButton(mode: UiMode, Icon: Component)}
  <button
    data-role='mode-button'
    class='qt-button flex flex-row self-center'
    aria-pressed={ui.mode === mode}
    onclick={() => {
      viewlogic.setMode(mode);
    }}
  >
    <div class='flex w-full justify-center align-center self-center'>
      <Icon />
    </div>
  </button>
{/snippet}


<style>
  .qt-button[data-role='mode-button'] {
    width: 32px;
    height: 100%;
    padding: 3px 3px;

    &:hover {
      color: var(--qt-text-default);
      background: var(--qt-hover-bg);
    }

    &[aria-pressed='true'] {
      color: var(--qt-accent-active);
      background: var(--qt-accent-blue-default);
    }

    &:has(+ &) {
      border-right: none;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    & + & {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
</style>
