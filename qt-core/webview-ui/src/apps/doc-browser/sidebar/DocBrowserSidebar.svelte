<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import DocBrowserTocView from './DocBrowserTocView.svelte';
  import DocBrowserIndexSearchList from './DocBrowserIndexSearchList.svelte';
  import DocBrowserFullTextSearchList from './DocBrowserFullTextSearchList.svelte';

  import { ui } from '../states.svelte';

</script>

<div class="w-[300px]">
  {#if ui.mode === 'toc'}
    <DocBrowserTocView />
  {:else if ui.mode === 'index'}
    <DocBrowserIndexSearchList />
  {:else}
    <DocBrowserFullTextSearchList />
  {/if}
</div>
