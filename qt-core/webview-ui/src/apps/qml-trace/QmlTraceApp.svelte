<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount } from 'svelte';
  import { ui } from './states.svelte';
  import * as viewlogic from './viewlogic.svelte';

  onMount(viewlogic.onAppMount);
</script>

<div
  bind:this={ui.container}
  class="screen">
</div>

<style>
  .screen {
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
</style>
