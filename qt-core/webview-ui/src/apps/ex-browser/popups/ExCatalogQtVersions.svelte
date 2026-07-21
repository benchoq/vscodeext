<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import Separator from '@/comps/Separator.svelte';
  import { exBrowser as texts } from '@/apps/texts';
  import { data, ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  let loading = $state(false);
</script>

<div class='flex flex-col'>
  <p class='title'>{texts.catalog.versions}</p>

  {#each data.packages as p, i (p)}
    {@const prev = data.packages[i-1]}
    <Separator
      class='my-2'
      visible={i!== 0 && prev.poolDir.sourceType !== p.poolDir.sourceType}
    />

    <button
      class='item'
      class:active={ui.selected.package === p}
      title={p.poolDir.fsPath}
      onclick={async () => {
        if (!loading) {
          loading = true;
          await viewlogic.selectPackage(p);
          loading = false;
        }
      }}
    >
      {p.subDir}
    </button>
  {/each}
  </div>

<style>
  .title {
    font-size: 11px;
    font-weight: 600;
    color: var(--qt-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 4px 12px 8px;
  }

  .item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    font-size: 13px;
    color: var(--qt-text-muted);
    cursor: pointer;
    border-radius: 0;
    transition: background 80ms, color 80ms;
  }

  .item.active {
    background: var(--qt-accent-info);
    color: var(--qt-button-fg);
  }
</style>
