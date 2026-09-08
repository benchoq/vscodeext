<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import * as viewlogic from './viewlogic.svelte';
  import { data } from './states.svelte';

</script>

<div class='flex flex-col gap-1'>
  {#each data.data as entry (entry.identifier)}
    <button
      class='qt-button flex align-start'
      onclick={() => {
        viewlogic.openDoc(entry);
      }}
    >
      {entry.name}
      ({entry.anchor})
    </button>
  {/each}
</div>
