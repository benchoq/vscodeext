<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';
  import ExTagChip from '../others/ExTagChip.svelte';

  const tags = $derived(ui.filter.tags);
</script>

{#if tags.length !== 0}
  <div data-comp-root class="flex flex-wrap">
    {#each tags as tag (tag)}
      <ExTagChip
        text={tag}
        onClicked={() => {
          viewlogic.toggleTag(tag);
        }}
      />
    {/each}
  </div>
{/if}

<style>
  [data-comp-root] {
    align-items: center;
    gap: 5px;
  }
</style>
