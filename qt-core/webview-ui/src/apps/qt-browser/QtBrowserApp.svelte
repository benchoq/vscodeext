<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import '@/styles/components/components.css';
  // import './QtBrowserApp.css';

  import QtBrowserToolbar from './QtBrowserToolbar.svelte';
  import QtBrowserHtmlView from './QtBrowserHtmlView.svelte';
  import * as viewlogic from './viewlogic.svelte';

  onMount(() => viewlogic.onAppMount());
  onDestroy(() => viewlogic.onAppDestroy());
</script>

<div class="w-screen h-screen flex flex-col gap-1 p-2">
  <QtBrowserToolbar />
  <QtBrowserHtmlView />
</div>
