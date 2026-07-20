<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { clickOutside } from '@/utils/actions';
  import ExOverlayCatalog from './ExOverlayCatalog.svelte';
  // import ExOverlayDetails from './ExOverlayDetails.svelte';
  // import ExOverlayTagCloud from './ExOverlayTagCloud.svelte';
  import { data, ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  const yoffset = 5;
  const catalogRefRect = $derived.by(() => {
    const r = ui.overlays.catalog?.refEl?.getBoundingClientRect();
    return {
      top: (r?.bottom ?? 0),
      left: (r?.left ?? 0)
    }
  })

</script>

{#if ui.overlays.catalog.visible && data.packages.length !== 0}
  <div
    class='fixed'
    style={`
      top: ${catalogRefRect.top + yoffset}px;
      left: ${catalogRefRect.left}px;
      width: 700px;
      height: 500px;
    `}
    use:clickOutside={(ev: MouseEvent) => {
      ev.stopPropagation();
      viewlogic.setOverlayVisible('catalog', false);
    }}
  >
    <ExOverlayCatalog />
  </div>
{/if}

<!--
{#if ui.overlays.details.visible}
  <div class={`
    absolute top-0 transition-x duration-200
    ${ui.overlays.details.alignLeft
      ? `left-0 translate-x-0`
      : 'left-full -translate-x-full' }
  `}>
    <ExOverlayDetails />
  </div>
{/if} -->
<!--
{#if ui.overlays.tagCloud.visible && (ui.filter.category?.tags.length ?? 0) !== 0}
  <ExOverlayTagCloud />
{/if} -->
