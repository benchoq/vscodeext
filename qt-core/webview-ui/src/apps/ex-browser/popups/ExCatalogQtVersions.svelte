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
  <p class='ex-catalog-section-title'>{texts.catalog.versions}</p>

  {#each data.packages as p, i (p)}
    {@const prev = data.packages[i-1]}
    <Separator
      class='my-2'
      visible={i!== 0 && prev.poolDir.sourceType !== p.poolDir.sourceType}
    />

    <button
      class='ex-catalog-list-item'
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
