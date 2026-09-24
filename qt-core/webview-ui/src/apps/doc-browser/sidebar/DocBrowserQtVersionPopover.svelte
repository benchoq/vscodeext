<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import Separator from '@/comps/Separator.svelte';
  import { data, ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';
</script>

<div class="qt-popover w-[150px] p-2">
  <div class='qt-item-list flex flex-col'>
    {#each data.packages as p, i (i)}
      {@const prev = data.packages[i - 1]}
      <Separator
        class="my-2"
        visible={i !== 0 && prev.source !== p.source}
      />

      <button
        class='item'
        class:active={ui.selected.package === p}
        onclick={(e: MouseEvent) => {
          void viewlogic.selectPackage(p);
          ui.popovers.qtVersions.visible = false;
          e.stopPropagation();
        }}
      >
        Qt-{p.version}
      </button>
    {/each}
    </div>
</div>
