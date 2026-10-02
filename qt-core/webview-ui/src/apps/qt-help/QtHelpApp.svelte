<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  // import { onMount, onDestroy } from 'svelte';

  import '@/styles/components/components.css';
  // import './QtBrowserApp.css';

  import QtBrowserApp from '../qt-browser/QtBrowserApp.svelte';

  // onMount(() => viewlogic.onAppMount());
  // onDestroy(() => viewlogic.onAppDestroy());
</script>

<div class="w-screen h-screen flex flex-row gap-1 p-2">
  <div class='w-[200px] h-full bg-amber-500/20'>
    hi
  </div>
  <div>
    <QtBrowserApp />
  </div>
</div>
