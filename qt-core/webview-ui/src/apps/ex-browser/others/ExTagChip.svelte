<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { Glyphs } from "@/icons";

  let {
    text = '',
    outline = false,
    selected = false,
    decorated = false,
    onClicked = (_: MouseEvent) => {}
  } = $props();
</script>

{#if text.length > 0}
  <button
    data-comp='tag-chip'
    data-root
    data-outline={outline}
    data-selected={selected}
    class='inline-flex'
    onclick={(e: MouseEvent) => {
      onClicked(e);
    }}
    >
    {#if !decorated}
      <span data-role='name'>{text}</span>
    {:else}
      <span data-role='hash'>#</span>
      <span data-role='name'>{text}</span>
      <span data-role='close'>
        {Glyphs.multiplication}
      </span>
    {/if}
  </button>
{/if}

<style>
  [data-root] {
    align-items: center;
    height: 20px;
    padding: 0 6px;
    border-radius: var(--qt-radius-s);
    background: var(--qt-bg-input);
    color: var(--qt-text-muted);
    border: 1px solid transparent;
    cursor: pointer;
    transition-property: background, border-color, color;
    transition-duration: var(--duration-short);
    gap: 4px;

    &:hover {
      background: var(--qt-hover-bg);
      color: var(--qt-text-default);
    }

    &[data-outline='true'] {
      background: transparent;
      border: 1px solid var(--qt-stroke-muted);
      color: var(--qt-text-muted);

      &:hover {
        background: var(--qt-hover-bg);
        border: 1px solid var(--qt-text-default);
        color: var(--qt-text-default);
      }
    }

    &[data-selected='true'] {
      background: var(--accent-blue-a22);
      border-color: var(--accent-blue-a55);
      color: var(--qt-accent-active);

      &:hover {
        background: var(--accent-blue-a35);
      }
    }
  }

  [data-role='hash'] {
    opacity: 0.6;
    margin-right: -2px;
  }

  [data-role='close'] {
    opacity: 0.55;
    margin-top: -0.5px;
    font-size: 10px;
  }
</style>
