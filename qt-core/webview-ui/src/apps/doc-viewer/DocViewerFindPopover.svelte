<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { type Component, onMount } from 'svelte';
  import { ChevronUp, ChevronDown, X } from '@lucide/svelte';

  import { ui } from './states.svelte';
  import * as viewlogic from './viewlogic.svelte';

  let inputEl: HTMLInputElement | undefined;

  function runAction(action: 'prev' | 'next' | 'close') {
    if (action === 'prev' || action === 'next') {
      viewlogic.findInPage(action);
      inputEl?.select();
    } else {
      viewlogic.findInPage('clear');
      ui.popovers.find.visible = false;
    }
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      runAction(e.shiftKey ? 'prev' : 'next');
    } else if (e.key === 'Escape') {
      runAction('close');
    }
  }

  function onFocus() {
    inputEl?.select();
  }

  onMount(() => {
    requestAnimationFrame(() => {
      inputEl?.focus();
      inputEl?.select();
    });
  });
</script>

<div data-root class="qt-popover h-[36px] flex flex-row items-center">
  <input
    bind:this={inputEl}
    bind:value={ui.popovers.find.keyword}
    data-role='find-input'
    class='qt-input min-w-[200px] self-stretch px-2'
    placeholder="Find in page"
    onkeydown={onKeyDown}
    onfocus={onFocus}
  />

  {@render toolButton('prev', ChevronUp)}
  {@render toolButton('next', ChevronDown)}
  {@render toolButton('close', X)}
</div>

{#snippet toolButton(action: 'prev' | 'next' | 'close', Icon: Component)}
  <button
    data-role='tool-button'
    class='qt-button'
    onclick={(e: MouseEvent) => {
      runAction(action);
      e.stopPropagation();
    }}
  >
    <Icon />
  </button>
{/snippet}

<style>
  .qt-input[data-role='find-input'] {
    background: none;
  }

  .qt-button[data-role='tool-button'] {
    border: none;
    background: transparent;
  }
</style>
