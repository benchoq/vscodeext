<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { icons } from '@/symbols';
  import { tooltip } from '@/utils/actions';
  import Separator from '@/comps/Separator.svelte';
  import ToolButton from '@/comps/ToolButton.svelte';
  import { data, ui } from './states.svelte';
  import * as viewlogic from './viewlogic.svelte';
</script>

<div data-role='area' class="qt-popover">
  <div class='qt-item-list flex flex-col'>
    {#each data.packages as p, i (i)}
      {@const prev = data.packages[i - 1]}
      <Separator
        class="my-2"
        visible={i !== 0 && prev.source !== p.source}
      />

      <div
        class='item w-full flex flex-row gap-2 relative group'
        class:active={ui.selected.package === p}
        use:tooltip={{
          text: p.fsPath,
          placement: 'right',
          delay: 0
        }}
      >
        <button
          class='w-full flex'
          class:active={ui.selected.package === p}
          onclick={(e: MouseEvent) => {
            void viewlogic.selectPackage(p);
            ui.popovers.qtVersions.visible = false;
            e.stopPropagation();
          }}
        >
          <span data-role='version'>Qt-{p.version}</span>
        </button>

        <div
          data-role='reveal-button'
          class='qt-absolute-cy invisible group-hover:visible'
          use:tooltip={{
            text: 'Reveal in the file manager',
            placement: 'bottom',
            offset: 10
          }}
        >
          <ToolButton
            onClicked={(e: MouseEvent) => {
              void viewlogic.revealPackageFolder(p);
              e.stopPropagation();
            }}
          >
            <icons.ExtLink size={12} />
          </ToolButton>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  [data-role='area'] {
    width: 200px;
  }

  [data-role='version'] {
    flex-shrink: 0;
    flex-grow: 1;
    text-align: start;
  }

  [data-role='reveal-button'] {
    right: 5px;
  }
</style>
