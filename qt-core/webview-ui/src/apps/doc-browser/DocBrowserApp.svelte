<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import '@/styles/components/components.css';
  import './DocBrowserApp.css';

  import * as viewlogic from './viewlogic.svelte';
  import { data } from './states.svelte';

  let value = $state('');

  onMount(() => viewlogic.onAppMount());
  onDestroy(() => viewlogic.onAppDestroy());
</script>

<div class="w-screen h-screen flex flex-col">
  <div class='flex flex-row'>
    <button
      class='qt-button'
      onclick={() => {
        viewlogic.search(value);
      }}
    >
      Search
    </button>
    <input
      type="text"
      class='qt-input'
      bind:value
    >
  </div>

  <div class='flex flex-col gap-1'>
    {#each data.data as entry (entry.identifier)}
      <button
        class='qt-button flex align-start'
        onclick={() => {
          viewlogic.openDoc(entry);
        }}
      >
        {entry.fileTitle} ({entry.anchor})
      </button>
    {/each}
  </div>
</div>
