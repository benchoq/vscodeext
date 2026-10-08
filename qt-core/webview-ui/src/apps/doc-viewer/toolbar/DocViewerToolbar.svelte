<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import {
    Dot,
    Star,
    Clock4,
    Columns2,
    Bookmark,
    ArrowLeft,
    ArrowRight,
    Binoculars
  } from "@lucide/svelte";
  import { type Component } from 'svelte';

  import { ui } from '../states.svelte';
  import * as helpers from '../helpers';
  import * as viewlogic from '../viewlogic.svelte';
  import './DocViewerToolbar.css';

  let el = $state(undefined as HTMLInputElement | undefined);
  let draft = $state<string | null>(null);

  const value = $derived(helpers.toFileUri(draft ?? ui.iframe.src));
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
    | 'back' | 'forward' | 'openInNewViewer' | 'toggleBookmark'
    | 'findDialog' | 'bookmarkView' | 'historyView';

  function isButtonEnabled(role: ButtonRole) {
    if (role === 'back' || role === 'forward') {
      return ui.history.canGo(role);
    }

    return true;
  }

  function isButtonChecked(role: ButtonRole) {
    switch (role) {
      case 'findDialog': return ui.popovers.find.visible;
      case 'bookmarkView': return ui.popovers.bookmark.visible;
      case 'historyView': return ui.popovers.history.visible;
      default:
        return false;
    }
  }

  function onButtonClicked(role: ButtonRole) {
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

      case 'findDialog':
        ui.popovers.find.visible = !ui.popovers.find.visible;
        break;

      case 'bookmarkView':
        viewlogic.setLayerVisible('bookmark', !ui.popovers.bookmark.visible);
        break;

      case 'historyView':
        viewlogic.setLayerVisible('history', !ui.popovers.history.visible);
        break;

      default:
        break;
    }
  }
</script>

<div data-area='toolbar' class='flex flex-row gap-2'>
  <div class='flex flex-row gap-0'>
    {@render roleButton('back', isButtonEnabled('back') ? ArrowLeft : Dot)}
    {@render roleButton('forward', isButtonEnabled('forward') ? ArrowRight : Dot)}
  </div>

  <div class='grow flex relative'>
    <input
      bind:this={el}
      {value}
      class='qt-input grow self-stretch pl-2 pr-[30px]'
      oninput={(e) => { draft = e.currentTarget.value; }}
      onblur={() => { draft = null;  }}
      onfocus={() => { selectAll(); }}
      onkeydown={onKeyDown}
    />

    <div class='qt-absolute-cy right-[2px]'>
      {@render roleButton('toggleBookmark', Star)}
    </div>
  </div>

  {@render roleButton('openInNewViewer', Columns2)}
  {@render roleButton('findDialog', Binoculars)}

  <div class='flex flex-row'>
    {@render roleButton('bookmarkView', Bookmark)}
    {@render roleButton('historyView', Clock4)}
  </div>
</div>

{#snippet roleButton(role: ButtonRole, Icon: Component)}
  <button
    bind:this={
      () => null,
      (el) => {
        if (role === 'findDialog') {
          ui.popovers.find.refEl = el;
        }
      }
    }
    data-role={role}
    aria-pressed={isButtonChecked(role)}
    class='qt-button flex items-center justify-center'
    disabled={!isButtonEnabled(role)}
    onclick={(e: MouseEvent) => {
      onButtonClicked(role);
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

  .qt-button[data-role='back'],
  .qt-button[data-role='forward'],
  .qt-button[data-role='historyView'],
  .qt-button[data-role='bookmarkView'] {
    &:hover {
      color: var(--qt-text-default);
      background: var(--qt-hover-bg);
    }

    &[aria-pressed='true'] {
      color: var(--qt-accent-active);
      background: var(--qt-accent-blue-default);
    }

    &:has(+ &) {
      border-right: none;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    & + & {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
</style>
