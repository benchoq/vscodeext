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
  import DocViewerSidePanel from './DocViewerSidePanel.svelte';
  import { ui } from './states.svelte';
  import * as viewlogic from './viewlogic.svelte';

  let {
    fullScreen = true,
  } = $props();

  onMount(() => viewlogic.onAppMount());
  onDestroy(() => viewlogic.onAppDestroy());
</script>

<div class='
  {fullScreen ? 'w-screen h-screen' : 'w-full h-full'}
  flex flex-col
'>
  <DocViewerToolbar />

  <div class="w-full h-full relative">
    <div class="absolute inset-0">
      <DocViewerHtmlView />
    </div>

    {#if ui.popovers.bookmark.visible || ui.popovers.history.visible}
      <div
        class='absolute top-0 right-0 h-full'
        style:width={`${ui.sidePanel.width}px`}
        transition:fly={{ duration: 120, x: 200, opacity: 0 }}
      >
        <DocViewerSidePanel />
      </div>
    {/if}
  </div>
</div>
