<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import type { Component } from 'svelte';

  import { clickOutside } from '@/utils/actions';
  import ExTagsPopover from './ExTagsPopover.svelte';
  import ExCatalogPopover from './catalog/ExCatalogPopover.svelte';
  import * as viewlogic from '../viewlogic.svelte';
  import { data, ui, type OverlayName } from '../states.svelte';

  interface Info {
    component: Component,
    pos: { top: number, left: number },
    visible: boolean
  }

  const popovers = $derived.by(() => {
    return {
      catalog: {
        component: ExCatalogPopover,
        pos: calcAnchorPos(ui.overlays.catalog.refEl),
        visible: (ui.overlays.catalog.visible && data.packages.length !== 0)
      },

      tags: {
        component: ExTagsPopover,
        pos: calcAnchorPos(ui.overlays.tags.refEl),
        visible: (ui.overlays.tags.visible && (ui.filter.category?.tags.length ?? 0) !== 0)
      }
    } as Record<OverlayName, Info>
  });


  function calcAnchorPos(refEl?: HTMLElement) {
    const yoffset = 5;
    const r = refEl?.getBoundingClientRect();
    return {
      top: (r?.bottom ?? 0) + yoffset,
      left: (r?.left ?? 0)
    };
  }
</script>

{@render Popover('tags')}
{@render Popover('catalog')}

{#snippet Popover(name: OverlayName)}
  {@const info = popovers[name]}

  {#if info.visible}
    <div
      class='fixed'
      style:top={info.pos.top + 'px'}
      style:left={info.pos.left + 'px'}
      use:clickOutside={(ev: MouseEvent) => {
        ev.stopPropagation();
        viewlogic.setOverlayVisible(name, false);
      }}
    >
      <info.component />
    </div>
  {/if}
{/snippet}
