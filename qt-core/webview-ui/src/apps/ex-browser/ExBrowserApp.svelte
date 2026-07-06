<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import '@/styles/app.css';
  import ExHeader from './ExHeader.svelte';
  import ExBody from './ExBody.svelte';
  import ExOverlaysContainer from './ExOverlaysContainer.svelte';
  import * as viewlogic from './viewlogic.svelte';

  onMount(() => viewlogic.onAppMount());
  onDestroy(() => viewlogic.onAppDestroy());
</script>

<div class='w-screen h-screen flex flex-col relative'>
  <ExHeader />
  <ExBody />
  <ExOverlaysContainer />
</div>
