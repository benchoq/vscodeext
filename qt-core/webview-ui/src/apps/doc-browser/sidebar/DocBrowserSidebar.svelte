<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import DocBrowserTocView from './DocBrowserTocView.svelte';
  import DocBrowserIndexView from './DocBrowserIndexView.svelte';
  import DocBrowserSearchResultView from './DocBrowserSearchResultView.svelte';
  import DocBrowserSidebarToolbar from './DocBrowserSidebarToolbar.svelte';
  import { ui } from '../states.svelte';

</script>

<div class="w-[300px] shrink-0 flex flex-col gap-1.5">
  <DocBrowserSidebarToolbar />

  {#if ui.mode === 'index'}
    <DocBrowserIndexView />
  {:else if ui.mode === 'text'}
    <DocBrowserSearchResultView />
  {:else}
    <DocBrowserTocView />
  {/if}
</div>
