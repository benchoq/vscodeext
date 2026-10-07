<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import {
    Plus,
    Star,
    Search,
    Clock4,
    Bookmark,
    ArrowLeft,
    ArrowRight
  } from "@lucide/svelte";
  import { type Component } from 'svelte';

  import { ui } from '../states.svelte';
  import * as helpers from '../helpers';
  import * as viewlogic from '../viewlogic.svelte';
  import './DocViewerToolbar.css';

  let el = $state(undefined as HTMLInputElement | undefined);
  let draft = $state<string | null>(null);

  const value = $derived(helpers.toFileUri(draft ?? ui.iframe.src));
  const popover = $derived(ui.popovers.find);
  const bookmarked = $derived(viewlogic.bookmark.has(
    helpers.toFileUri(ui.iframe.src)
  ));

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      viewlogic.openUri(value);
      reset();
    } else if (e.key === 'Escape') {
      reset();
    }
  }

  function reset() {
    draft = null;
    requestAnimationFrame(() => { selectAll(); });
  }

  function selectAll() {
    el?.select();
  }

  type ButtonRole =
    | 'back' | 'forward'
    | 'openInNewViewer' | 'toggleBookmark'
    | 'toggleFindPopover' | 'toggleBookmarksList' | 'toggleHistoryList';

  function isEnabled(role: ButtonRole) {
    if (role === 'back' || role === 'forward') {
      return ui.history.canGo(role);
    }

    return true;
  }

  function onRoleButtonClicked(role: ButtonRole) {
    switch (role) {
      case 'back':
      case 'forward':
        viewlogic.navigate(role);
        break;

      case 'openInNewViewer':
        viewlogic.openInNewViewer(ui.iframe.src);
        break;

      case 'toggleBookmark':
        viewlogic.bookmark.edit({
          action: 'toggle',
          entry: {
            uri: helpers.toFileUri(ui.iframe.src),
            title: ui.iframe.title
          }
        })
        break;

      case 'toggleFindPopover':
        popover.visible = !popover.visible;
        break;

      case 'toggleBookmarksList':
        viewlogic.setLayerVisible('bookmark', !ui.popovers.bookmark.visible);
        break;

      case 'toggleHistoryList':
        viewlogic.setLayerVisible('history', !ui.popovers.history.visible);
        break;

      default:
        break;
    }
  }
</script>

<div data-area='toolbar' class='flex flex-row gap-1'>
  {@render roleButton('back', ArrowLeft)}
  {@render roleButton('forward', ArrowRight)}

  <div class='grow flex relative'>
    <input
      bind:this={el}
      {value}
      class='qt-input grow self-stretch px-2'
      oninput={(e) => { draft = e.currentTarget.value; }}
      onblur={() => { draft = null;  }}
      onfocus={() => { selectAll(); }}
      onkeydown={onKeyDown}
    />

    <div class='qt-absolute-cy right-[2px]'>
      {@render roleButton('toggleBookmark', Star)}
    </div>
  </div>

  {@render roleButton('openInNewViewer', Plus)}
  {@render roleButton('toggleFindPopover', Search)}
  {@render roleButton('toggleBookmarksList', Bookmark)}
  {@render roleButton('toggleHistoryList', Clock4)}
</div>

{#snippet roleButton(role: ButtonRole, Icon: Component)}
  <button
    bind:this={
      () => null,
      (el) => {
        if (role === 'toggleFindPopover') {
          popover.refEl = el;
        }
      }
    }
    data-role={role}
    class='qt-button flex items-center justify-center'
    disabled={!isEnabled(role)}
    onclick={(e: MouseEvent) => {
      onRoleButtonClicked(role);
      e.stopPropagation();
    }}
  >
    <Icon fill={
      (role === 'toggleBookmark' && bookmarked)
      ? 'currentColor' : 'transparent'
    }/>
  </button>
{/snippet}

<style>
  [data-role='toggleBookmark'] {
    border: none;
    background: none;
  }
</style>
