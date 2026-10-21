<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from '../states.svelte';
  import * as helpers from '../helpers';
  import * as viewlogic from '../viewlogic.svelte';
  import * as toolbar from './DocViewerToolbar';

  let inputEl = $state(undefined as HTMLInputElement | undefined);
  const value = $derived(ui.iframe.errorCode ? '' : ui.iframe.title);
  const bookmarked = $derived(viewlogic.bookmark.has(
    helpers.toFileUri(ui.iframe.uri)
  ));

  function selectAll() {
    inputEl?.select();
  }
</script>

<div data-area='toolbar' class='flex flex-row gap-2'>
  <div class='flex flex-row gap-0'>
    {@render actionButton('back')}
    {@render actionButton('forward')}
  </div>

  <div class='grow flex relative'>
    <input
      bind:this={inputEl}
      value={value}
      title={helpers.toFileUri(ui.iframe.uri)}
      class='qt-input grow self-stretch pl-2 pr-[30px]'
      readonly={true}
      onfocus={() => { selectAll(); }}
    />

    <div class='qt-absolute-cy right-[2px]'>
      {@render actionButton('toggleBookmark')}
    </div>
  </div>

  {@render actionButton('openInNewViewer')}
  {@render actionButton('findDialog')}

  <div class='flex flex-row'>
    {@render actionButton('bookmarkView')}
    {@render actionButton('historyView')}
  </div>
</div>

{#snippet actionButton(action: toolbar.Action)}
  {@const Icon = toolbar.findIcon(action)}
  {@const needToFill = bookmarked && (action === 'toggleBookmark')}
  <button
    bind:this={
      () => null,
      (el) => {
        if (action === 'findDialog') {
          ui.popovers.find.refEl = el;
        }
      }
    }
    data-role={action}
    aria-pressed={toolbar.isChecked(action)}
    class='qt-button flex items-center justify-center'
    disabled={!toolbar.isEnabled(action)}
    onclick={(e: MouseEvent) => {
      toolbar.onClicked(action);
      e.stopPropagation();
    }}
  >
    <Icon fill={needToFill ? 'currentColor' : 'transparent'} />
  </button>
{/snippet}

<style>
  [data-area='toolbar'] {
    padding: 8px;
    background: var(--qt-bg-editor-tab);
    border-bottom: 1px solid var(--qt-stroke-subtle);
  }

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
