<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fly } from 'svelte/transition';

  import '@/styles/components/components.css';
  import './DocViewerApp.css';

  import DocViewerToolbar from './toolbar/DocViewerToolbar.svelte';
  import DocViewerHtmlView from './DocViewerHtmlView.svelte';
  import DocViewerHistoryView from './history/DocViewerHistoryView.svelte';
  import DocViewerBookmarkView from './bookmark/DocViewerBookmarkView.svelte';

  import { ui } from './states.svelte';
  import * as viewlogic from './viewlogic.svelte';

  let {
    standalone = true,
  } = $props();

  onMount(() => viewlogic.onAppMount());
  onDestroy(() => viewlogic.onAppDestroy());
</script>

<div class='
  {standalone ? 'w-screen h-screen' : 'w-full h-full'}
  flex flex-col
'>
  <DocViewerToolbar />

  <div class="w-full h-full relative">
    <div class="absolute inset-0">
      <DocViewerHtmlView />
    </div>

    {#if ui.popovers.bookmark.visible || ui.popovers.history.visible}
      <div
        data-role='background'
        class='absolute top-0 right-0 w-[400px] h-full'
        transition:fly={{ duration: 120, x: 200, opacity: 0 }}
      >
        {#if ui.popovers.bookmark.visible}
          <DocViewerBookmarkView />
        {/if}

        {#if ui.popovers.history.visible}
          <DocViewerHistoryView />
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  [data-role='background'] {
    background: var(--qt-bg-subtle);
    border-left: 1px solid var(--qt-stroke-subtle);
    opacity: 0.90;
  }
</style>
