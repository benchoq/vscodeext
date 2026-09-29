<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { type Component } from 'svelte';
  import { ChevronUp, ChevronDown, X } from '@lucide/svelte';

  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';
  import { type FindAction } from '../types.svelte';

</script>

<div data-root class="qt-popover h-[36px] flex flex-row">
  <input
    bind:value={ui.popovers.find.keyword}
    data-role='find-input'
    class='qt-input min-w-[200px] px-2'
    placeholder="Find in page"

  />
  {@render toolButton('prev', ChevronUp)}
  {@render toolButton('next', ChevronDown)}
  {@render toolButton('clear', X)}
</div>

{#snippet toolButton(role: FindAction, Icon: Component)}
  <button
    data-role='tool-button'
    class='qt-button'
    onclick={(e: MouseEvent) => {
      viewlogic.findInPage(role);
      e.stopPropagation();
    }}
  >
    <Icon />
  </button>
{/snippet}

<style>
  .qt-input[data-role='find-input'] {
    background: none;
  }

  .qt-button[data-role='tool-button'] {
    border: none;
    background: transparent;
  }
</style>
