<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { PackageCheck } from '@lucide/svelte';

  import { icons } from '@/symbols';
  import { tooltip } from '@/utils/actions';
  import Separator from '@/comps/Separator.svelte';
  import ToolButton from '@/comps/ToolButton.svelte';
  import { data, ui } from './states.svelte';
  import * as viewlogic from './viewlogic.svelte';
  import { type QtDocRootInfo } from '@shared/qt-help';

  const annotation = $derived.by(() => {
    const length = data.packages.length;
    if (length === 0) {
      return 'No Qt versions found';
    }

    return `Total ${length} Qt version${length > 1 ? 's' : ''}`;
  });
</script>

<div data-role='area' class="qt-popover">
  <div class='qt-item-list flex flex-col'>
    {#each data.packages as p, i (i)}
      {@const prev = data.packages[i - 1]}
      {#if i !== 0 && prev.source !== p.source}
        <Separator />
      {/if}

      <div
        class='item w-full relative group'
        class:active={ui.selected.package === p}
        use:tooltip={{ text: p.fsPath, placement: 'right', delay: 0 }}
      >
        {@render itemButton(p)}
        {@render revealButton(p)}
      </div>
    {/each}

    {@render footer()}
  </div>
</div>

<!-- snippets -->
{#snippet itemButton(p: QtDocRootInfo)}
  <button
    class='w-full flex cursor-pointer'
    class:active={ui.selected.package === p}
    onclick={(e: MouseEvent) => {
      void viewlogic.selectPackage(p);
      ui.popovers.qtVersions.visible = false;
      e.stopPropagation();
    }}
  >
    <span data-role='version'>Qt-{p.version}</span>
  </button>
{/snippet}

{#snippet revealButton(p: QtDocRootInfo)}
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
{/snippet}

{#snippet footer()}
  <Separator />
  <div data-role='footer' class='w-full flex flex-row gap-2'>
    <PackageCheck />
    <span data-role='annotation'>{annotation}</span>
  </div>
{/snippet}

<style>
  [data-role='area'] {
    min-width: 200px;
  }

  [data-role='version'] {
    flex-shrink: 0;
    flex-grow: 1;
    text-align: start;
  }

  [data-role='reveal-button'] {
    right: 5px;
  }

  [data-role='footer'] {
    padding: 10px;
    color: var(--qt-text-muted);
    opacity: 0.6;
  }
</style>
