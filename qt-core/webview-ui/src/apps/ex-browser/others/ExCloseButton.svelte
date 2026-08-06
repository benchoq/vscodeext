<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import ExToolButton from '../others/ExToolButton.svelte';

  let {
    visible = true,
    onClicked = (_: MouseEvent) => {}
  } = $props();

</script>

{#if visible}
  <ExToolButton
    onClicked={(e: MouseEvent) => {
      onClicked(e);
      e.stopPropagation();
    }}
  >
    <span data-comp='close-button'>&times;</span>
  </ExToolButton>
{/if}
