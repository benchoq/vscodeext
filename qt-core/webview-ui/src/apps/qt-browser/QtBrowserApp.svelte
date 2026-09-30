<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import '@/styles/components/components.css';
  import './QtBrowserApp.css';

  import QtBrowserToolbar from './QtBrowserToolbar.svelte';
  import QtBrowserHtmlView from './QtBrowserHtmlView.svelte';
  import QtBrowserBookmarkView from './QtBrowserBookmarkView.svelte';
  import * as viewlogic from './viewlogic.svelte';
  import { ui } from './states.svelte';

  onMount(() => viewlogic.onAppMount());
  onDestroy(() => viewlogic.onAppDestroy());
</script>

<div class="w-screen h-screen flex flex-col gap-1 p-2">
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
  </div>
</div>
