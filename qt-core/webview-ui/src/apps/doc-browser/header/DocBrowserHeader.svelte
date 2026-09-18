<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import * as viewlogic from '../viewlogic.svelte';

  let value = $state('QObject');
  let timer: ReturnType<typeof setTimeout>;
  let searchTarget = $state('' as 'index' | 'text');

  function triggerUpdate(delay = 200) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      viewlogic.setMode(searchTarget);
      if (searchTarget === 'text') {
        viewlogic.search(value);
      }
    }, delay);
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      triggerUpdate(0);
    }
  }
</script>

<div class='flex flex-row h-[32px] gap-2'>
  <button
    class='qt-button'
    onclick={() => {
      viewlogic.setMode('toc');
    }}
  >
    Contents
  </button>

  <button
    class='qt-button'
    onclick={() => {
      viewlogic.setMode('index');
    }}
  >
    Indexes
  </button>

  <div class='flex flex-row gap-2'>
    <input
      bind:value
      type="text"
      class='qt-input w-[300px]'
      oninput={() => {
        triggerUpdate(200);
      }}
      onkeydown={onKeydown}
    >

    <button
      class='qt-button'
      onclick={() => {
        searchTarget = 'text';
        triggerUpdate(0);
      }}
    >
      Search text
    </button>
  </div>
</div>