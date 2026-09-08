<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import * as viewlogic from './viewlogic.svelte';
  import { data, ui } from './states.svelte';

</script>

<div
  data-role='list'
  class='qt-item-list flex flex-col'
>
  {#each data.data as entry (entry.identifier)}
    <button
      class='item flex align-start'
      class:active={ui.selected.entry === entry}
      onclick={() => {
        viewlogic.openDoc(entry);
      }}
    >
      {entry.identifier}
    </button>
  {/each}
</div>

<style>
  [data-role='list'] {
    border: 1px solid #333333;
    height: 100%;
    min-height: 0;
    overflow: auto;
  }

  .qt-item-list {
    & .item {
      padding: 2px 4px;
    }
  }
</style>
