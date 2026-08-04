<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import * as chars from '@/utils/chars';
  import { exBrowser as texts } from '@/apps/texts';

  import ExToolButton from '../others/ExToolButton.svelte';
  import { data, ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

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
    if (e.key === 'Enter') {
      triggerUpdate(0);
    }
  }
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
    oninput={() => { triggerUpdate(200); }}
    onkeydown={onKeydown}
  />

  <div
    data-close-button
    class:invisible={value.trim().length === 0}
  >
    <ExToolButton onClicked={() => clear()}>
      &times;
    </ExToolButton>
  </div>
</div>

<style>
  [data-close-button] {
    position: absolute;
    top: 50%;
    right: 5px;
    transform: translateY(-50%);
  }
</style>
