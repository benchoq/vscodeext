<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import '@/styles/components/components.css';
  import './DocBrowserApp.css';

  import DocBrowserHeader from './DocBrowserHeader.svelte';
  import DocBrowserView from './DocBrowserView.svelte';
  import DocBrowserTocView from './DocBrowserTocView.svelte';
  import DocBrowserIndexSearchList from './DocBrowserIndexSearchList.svelte';

  import * as viewlogic from './viewlogic.svelte';
  import { ui } from './states.svelte';

  onMount(() => viewlogic.onAppMount());
  onDestroy(() => viewlogic.onAppDestroy());
</script>

<div class="w-screen h-screen flex flex-col gap-1 p-2">
  <DocBrowserHeader />

  <div data-body class='flex flex-row grow gap-2'>
    <div class="w-[300px]">
      {#if ui.mode === 'toc'}
        <DocBrowserTocView />
      {:else}
        <DocBrowserIndexSearchList />
      {/if}
    </div>
    <DocBrowserView />
  </div>
</div>

<style>
  [data-body] {
    flex: 1;
    height: 100%;
    min-height: 0;
    overflow: hidden;
  }
</style>
