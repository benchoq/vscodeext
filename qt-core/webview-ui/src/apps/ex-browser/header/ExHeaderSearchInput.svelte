<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { data, ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';
  import { exBrowser as texts } from '@/apps/texts';

  let value = $derived(ui.filter.query);
  let timer: ReturnType<typeof setTimeout>;
  const charSearchIcon = '⌕';

  const placeholder = $derived.by(() => {
    if (!ui.filter.category
      || !ui.filter.category.name
      || ui.filter.category.type === 'all') {
      return texts.searchBox.defaultPlaceholder;
    }

    return texts.searchBox.placeholder(ui.filter.category.name);
  });

  function clear() {
    value = '';
    triggerUpdate(0);
  }

  function triggerUpdate(delay = 200) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      viewlogic.setQuery(value);
    }, delay);
  }

  function onKeydown(e: KeyboardEvent) {
    switch (e.key) {
      case 'Enter':
        triggerUpdate(0);
        viewlogic.setOverlayVisible('tagCloud', false);
        break;

      case ' ':
      case 'Escape':
      case 'Backspace':
        viewlogic.setOverlayVisible('tagCloud', false);
        break;

      case '#':
        viewlogic.setOverlayVisible('tagCloud', true);
        break;
    }
  }

  function onFocusIn() {
    viewlogic.setOverlayVisible('catalog', false);
  }

  $effect(() => {
    value = ui.filter.query;
  })
</script>


<div class='relative w-full h-full flex-grow flex flex-row items-center gap-2'>
  <div class='absolute left-4 top-1/2 -translate-y-1/2'>
    {charSearchIcon}
  </div>

  <input
    bind:value
    type='text'
    class='search-input w-full'
    {placeholder}
    disabled={data.packages.length === 0}
    oninput={() => { triggerUpdate(500); }}
    onkeydown={onKeydown}
    onfocusin={onFocusIn}
  />

  <div
    class='absolute right-4 top-1/2 -translate-y-1/2'
    class:invisible={value.trim().length === 0}
    style:font-size='13px'
  >
    <button onclick={clear} class='cursor-pointer'>
      X
    </button>
  </div>
</div>

<style>
  .search-input {
    height: 28px;
    padding: 0 26px 0 29px;

    color: var(--vscode-input-foreground, var(--qt-text-default));
    background: var(--qt-bg-input);
    border: 1px solid var(--vscode-input-border, transparent);
    border-radius: var(--qt-radius-s);
    outline: none;

    font-family: inherit;
    font-size: 13px;
  }

  .search-input:focus {
    border-color: var(--qt-accent-info);
    box-shadow: none;
  }
</style>
