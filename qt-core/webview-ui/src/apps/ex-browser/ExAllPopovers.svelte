<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import type { Component } from 'svelte';

  import { clickOutside } from '@/utils/actions';
  import ExTagsPopover from './header/popovers/ExTagsPopover.svelte';
  import ExCatalogPopover from './header/popovers/ExCatalogPopover.svelte';
  import * as viewlogic from './viewlogic.svelte';
  import { data, ui, type PopoverName } from './states.svelte';

  interface Info {
    component: Component,
    pos: { top: number, left: number },
    offset: number,
    visible: boolean
  }

  const popovers = $derived.by(() => {
    return {
      catalog: {
        component: ExCatalogPopover,
        pos: calcAnchorPos(ui.popovers.catalog.refEl),
        offset: 5,
        visible: (ui.popovers.catalog.visible && data.packages.length !== 0)
      },

      tags: {
        component: ExTagsPopover,
        pos: calcAnchorPos(ui.popovers.tags.refEl),
        offset: 5,
        visible: (ui.popovers.tags.visible && (ui.filter.category?.tags.length ?? 0) !== 0)
      },
    } as Record<PopoverName, Info>
  });


  function calcAnchorPos(refEl?: HTMLElement) {
    const r = refEl?.getBoundingClientRect();
    return {
      top: (r?.bottom ?? 0),
      left: (r?.left ?? 0)
    };
  }
</script>

{@render popover('tags')}
{@render popover('catalog')}

{#snippet popover(name: PopoverName)}
  {@const p = popovers[name]}

  {#if p.visible}
    <div
      class='fixed'
      style:top={(p.pos.top + p.offset) + 'px'}
      style:left={p.pos.left + 'px'}
      use:clickOutside={(ev: MouseEvent) => {
        ev.stopPropagation();
        viewlogic.setPopoverVisible(name, false);
      }}
    >
      <p.component />
    </div>
  {/if}
{/snippet}
