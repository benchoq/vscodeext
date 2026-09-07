<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import '@/styles/components/components.css';
  import './DocBrowserApp.css';

  import * as viewlogic from './viewlogic.svelte';
  // import { ui } from './states.svelte';

  onMount(() => viewlogic.onAppMount());
  onDestroy(() => viewlogic.onAppDestroy());
</script>

<div class="w-screen h-screen flex flex-col">
  <button
    onclick={() => {
      viewlogic.ping();
    }}
  >
  Click me
  </button>
</div>
