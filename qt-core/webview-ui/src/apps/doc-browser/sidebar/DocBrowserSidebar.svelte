<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import DocBrowserTocView from './DocBrowserTocView.svelte';
  import DocBrowserIndexList from './DocBrowserIndexList.svelte';
  import DocBrowserSearchResultList from './DocBrowserSearchResultList.svelte';

  import { ui } from '../states.svelte';

</script>

<div class="w-[300px] shrink-0">
  {#if ui.mode === 'index'}
    <DocBrowserIndexList />
  {:else if ui.mode === 'text'}
    <DocBrowserSearchResultList />
  {:else}
    <DocBrowserTocView />
  {/if}
</div>
