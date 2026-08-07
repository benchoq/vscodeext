<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { slide, fade } from 'svelte/transition';
  import { cubicOut, cubicIn } from 'svelte/easing';

  import { ChevronRight } from '@/icons';
  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';
  import ExCloseButton from '../others/ExCloseButton.svelte';
  import ExActionNewProjectInput from './ExActionNewProjectInput.svelte';

  function toggleOpen() {
    viewlogic.setNewProjectFormVisible(!ui.sideBar.expanded);
  }
</script>

<div class='flex flex-col'>
  <button
    data-variant='secondary'
    class='qt-button flex flex-row'
    onclick={toggleOpen}
  >
    <span
      data-chevron
      style:transform={ui.sideBar.expanded ? 'rotate(90deg)' : 'rotate(0deg)'}
    >
      <ChevronRight size={16} />
    </span>

    <span>Use as a template</span>
    <div class='grow'></div>

    {#if ui.sideBar.expanded}
      <ExCloseButton onClicked={toggleOpen} />
    {/if}
  </button>

  {#if ui.sideBar.expanded}
    <div
      in:fade={{ duration:500, easing:cubicOut }}
      out:slide={{ duration:150, easing:cubicIn }}
    >
      <ExActionNewProjectInput />
    </div>
  {/if}
</div>

<style>
  .qt-button {
    height: 24px;
    padding-right: 3px;
    border: none;
  }

  [data-chevron] {
    transition: transform var(--duration-base);
  }
</style>
