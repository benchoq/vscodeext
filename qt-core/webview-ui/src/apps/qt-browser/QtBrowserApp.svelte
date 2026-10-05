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

    {#if ui.layers.bookmark}
      <div class="absolute inset-0">
        <QtBrowserBookmarkView />
      </div>
    {/if}

    {#if ui.layers.history}
      <div class="absolute inset-0">
        <QtBrowserHistoryView />
      </div>
    {/if}
  </div>
</div>
