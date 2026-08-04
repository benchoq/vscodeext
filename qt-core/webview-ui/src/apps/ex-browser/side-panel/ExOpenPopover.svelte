<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { type ExActionTypes } from '@shared/ex-browser';
  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';
  import ExSeparator from '../others/ExSeparator.svelte';

  const width = $derived.by(() => {
    const r = ui.popovers.openExample.refEl?.getBoundingClientRect();
    return r ? r.width : 100;
  });
</script>

<div
  data-comp-root
  class='flex flex-col'
  style:width={`${width}px;`}
>
  {@render Item('Open in new window', 'project-open')}
  {@render Item('Add to workspace', 'project-open-as-workspace')}
  <ExSeparator margin='2px' />
  {@render Item('Reveal in the file manager', 'project-reveal')}
</div>

{#snippet Item(text: string, action: ExActionTypes)}
  <button
    data-item
    onclick={() => {
      viewlogic.runExAction(action);
      viewlogic.setPopoverVisible('openExample', false);
    }}
  >
    {text}
  </button>

{/snippet}

<style>
  [data-comp-root] {
    background: var(--qt-dropdown-bg);
    border: 1px solid var(--qt-dropdown-border);
    border-radius: 3px;
    box-shadow: 0 4px 14px rgba(0,0,0,0.55);
    z-index: 200;
    padding: 2px 0;
  }

  [data-item] {
    gap: 8px;
    width: 100%;
    padding: 5px 10px;
    background: none;
    border: none;
    color: var(--qt-dropdown-fg);
    font-family: inherit;
    font-size: 12px;
    cursor: pointer;
    text-align: left;

    &:hover {
      background: var(--qt-selected-bg);
      color: var(--qt-selected-fg);
    }
  }
</style>
