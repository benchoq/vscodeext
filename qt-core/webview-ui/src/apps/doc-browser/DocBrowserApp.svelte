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
  import DocBrowserSearchList from './DocBrowserSearchList.svelte';

  import * as viewlogic from './viewlogic.svelte';

  onMount(() => viewlogic.onAppMount());
  onDestroy(() => viewlogic.onAppDestroy());
</script>

<div class="w-screen h-screen flex flex-col gap-1 p-2">
  <DocBrowserHeader />

  <div class='flex flex-row grow gap-2'>
    <DocBrowserSearchList />
    <DocBrowserView />
  </div>
</div>
