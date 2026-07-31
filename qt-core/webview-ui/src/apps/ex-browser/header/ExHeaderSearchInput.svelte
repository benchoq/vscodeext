<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import * as chars from '@/utils/chars';
  import { data, ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';
  import { exBrowser as texts } from '@/apps/texts';

  let value = $derived(ui.filter.searchInput);
  let timer: ReturnType<typeof setTimeout>;

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
      viewlogic.setSearchInput(value);
    }, delay);
  }

  function onKeydown(e: KeyboardEvent) {
    switch (e.key) {
      case 'Enter':
        triggerUpdate(0);
        viewlogic.setOverlayVisible('tags', false);
        break;

      case ' ':
      case 'Escape':
      case 'Backspace':
        viewlogic.setOverlayVisible('tags', false);
        break;

      case '#':
        viewlogic.setOverlayVisible('tags', true);
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

<div class='qt-search-input w-full relative'>
  <div data-decorations class='magnifier'>
    {chars.magnifier}
  </div>

  <input
    bind:value
    type='text'
    class='w-full'
    {placeholder}
    disabled={data.packages.length === 0}
    oninput={() => { triggerUpdate(500); }}
    onkeydown={onKeydown}
    onfocusin={onFocusIn}
  />

  <button
    data-decorations
    class='clear'
    class:invisible={value.trim().length === 0}
    onclick={clear}
  >
    &times;
  </button>
</div>
