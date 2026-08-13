<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { type ExActionTypes } from '@shared/ex-browser';
  import * as icons from '@/icons';
  import { clickOutside, portal, placeNear } from '@/utils/actions';

  import ExSeparator from '../others/ExSeparator.svelte';
  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  let menuVisible = $state(false);
  let menuReference = $state<HTMLButtonElement>();
</script>

<button
  bind:this={menuReference}
  data-variant={!ui.sideBar.expanded ? 'primary' : 'secondary'}
  data-active={ui.popovers.openExample.visible}
  class='qt-button flex flex-row items-center'
  onclick={(e: MouseEvent) => {
    menuVisible = true;
    e.stopPropagation();
  }}
>
  <icons.FolderOpen />
  Open example
</button>

{#if menuVisible}
  <div
    data-role='menu'
    use:portal
    use:placeNear={menuReference}
    use:clickOutside={(e: MouseEvent) => {
      e.stopPropagation();
      menuVisible = false;
    }}
    class='qt-dropdown fixed flex flex-col'
  >
    {@render menuItem('Open in new window', 'project-open')}
    {@render menuItem('Add to workspace', 'project-open-as-workspace')}
    <ExSeparator margin='2px' />
    {@render menuItem('Reveal in the file manager', 'project-reveal')}
  </div>
{/if}

{#snippet menuItem(text: string, action: ExActionTypes)}
  <button
    data-role='menu-item'
    onclick={() => {
      viewlogic.runExAction(action);
      viewlogic.setPopoverVisible('openExample', false);
    }}
  >
    {text}
  </button>
{/snippet}

<style>
  .qt-button {
    border: none;

    &[data-active='true'] {
      background: var(--qt-button-primary-hover);
    }
  }

  [data-role='menu'] {
    z-index: 200;
    padding: 2px 0;
  }

  [data-role='menu-item'] {
    gap: 8px;
    width: 100%;
    padding: 5px 10px;
    background: none;
    border: none;
    color: var(--qt-dropdown-fg);
    cursor: pointer;
    font-family: inherit;
    font-size: 12px;
    text-align: left;

    &:hover {
      background: var(--qt-selected-bg);
      color: var(--qt-selected-fg);
    }
  }
</style>
