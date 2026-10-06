<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import '@/styles/components/components.css';
  import './QtBrowserApp.css';

  import QtBrowserToolbar from './toolbar/QtBrowserToolbar.svelte';
  import QtBrowserHtmlView from './QtBrowserHtmlView.svelte';
  import QtBrowserHistoryView from './history/QtBrowserHistoryView.svelte';
  import QtBrowserBookmarkView from './bookmark/QtBrowserBookmarkView.svelte';

  import * as viewlogic from './viewlogic.svelte';
  import { ui } from './states.svelte';

  let {
    standalone = true,
  } = $props();

  onMount(() => viewlogic.onAppMount());
  onDestroy(() => viewlogic.onAppDestroy());
</script>

<div class='
  {standalone ? 'w-screen h-screen' : 'w-full h-full'}
  flex flex-col gap-1
'>
  <QtBrowserToolbar />

  <div class="w-full h-full relative">
    <div class="absolute inset-0">
      <QtBrowserHtmlView />
    </div>

    {#if ui.popovers.bookmark.visible || ui.popovers.history.visible}
      <div
        data-role='background'
        class='absolute top-0 right-0 w-[400px] h-full'
      >
        {#if ui.popovers.bookmark.visible}
          <QtBrowserBookmarkView />
        {/if}

        {#if ui.popovers.history.visible}
          <QtBrowserHistoryView />
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
