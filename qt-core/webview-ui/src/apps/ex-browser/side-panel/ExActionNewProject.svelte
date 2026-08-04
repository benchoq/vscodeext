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
  import ExActionNewProjectInput from './ExActionNewProjectInput.svelte';
</script>

<div class='flex flex-col'>
  <button
    class='qt-button-v2 flex flex-row'
    onclick={() => {
      viewlogic.setNewProjectFormVisible(!ui.sideBar.expanded);
    }}
  >
    <span
      data-chevron
      style:transform={ui.sideBar.expanded ? 'rotate(90deg)' : 'rotate(0deg)'}
    >
      <ChevronRight size={16} />
    </span>

    Use as a template
  </button>

  {#if ui.sideBar.expanded}
    <div
      class='flex flex-col'
      in:fade={{ duration:500, easing:cubicOut }}
      out:slide={{ duration:150, easing:cubicIn }}
    >
      <ExActionNewProjectInput />
    </div>
  {/if}
</div>

<style>
  [data-chevron] {
    transition: transform var(--duration-base);
  }
</style>
