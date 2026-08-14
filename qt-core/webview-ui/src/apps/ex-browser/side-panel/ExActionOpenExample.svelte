<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { type ExActionTypes } from '@shared/ex-browser';
  import { icons } from '@/symbols';
  import { exBrowser } from '@/apps/texts';
  import { clickOutside, portal, placeNear } from '@/utils/actions';

  import ExSeparator from '../others/ExSeparator.svelte';
  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  const texts = exBrowser.details.actions.openExample;
  let menu = $state({
    visible: false,
    reference: undefined as HTMLButtonElement | undefined
  });
</script>

<button
  bind:this={menu.reference}
  data-variant={!ui.sideBar.expanded ? 'primary' : 'secondary'}
  data-active={menu.visible}
  class="qt-button flex flex-row items-center"
  onclick={(e: MouseEvent) => {
    menu.visible = true;
    e.stopPropagation();
  }}
>
  <icons.FolderOpen />
  {texts.button}
</button>

{#if menu.visible}
  <div
    data-role="menu"
    use:portal
    use:placeNear={{ ref: menu.reference, width: 'full' }}
    use:clickOutside={(e: MouseEvent) => {
      menu.visible = false;
      e.stopPropagation();
    }}
    class="qt-dropdown fixed flex flex-col"
  >
    {@render menuItem(texts.menuNew, 'project-open')}
    {@render menuItem(texts.menuAdd, 'project-open-as-workspace')}
    <ExSeparator margin="2px" />
    {@render menuItem(texts.menuReveal, 'project-reveal')}
  </div>
{/if}

{#snippet menuItem(text: string, action: ExActionTypes)}
  <button
    data-role="menu-item"
    onclick={(e: MouseEvent) => {
      menu.visible = false;
      viewlogic.runExAction(action);
      e.stopPropagation();
    }}
  >
    {text}
  </button>
{/snippet}

<style>
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
    font-size: var(--qt-font-s);
    text-align: left;

    &:hover {
      background: var(--qt-selected-bg);
      color: var(--qt-selected-fg);
    }
  }
</style>
