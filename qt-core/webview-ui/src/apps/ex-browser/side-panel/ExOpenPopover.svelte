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
  data-root
  class='qt-dropdown flex flex-col'
  style:width={`${width}px;`}
>
  {@render Item('Open in new window', 'project-open')}
  {@render Item('Add to workspace', 'project-open-as-workspace')}
  <ExSeparator margin='2px' />
  {@render Item('Reveal in the file manager', 'project-reveal')}
</div>

{#snippet Item(text: string, action: ExActionTypes)}
  <button
    data-role='open-example-item'
    onclick={() => {
      viewlogic.runExAction(action);
      viewlogic.setPopoverVisible('openExample', false);
    }}
  >
    {text}
  </button>

{/snippet}

<style>
  [data-root] {
    z-index: 200;
    padding: 2px 0;
  }

  [data-role='open-example-item'] {
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
