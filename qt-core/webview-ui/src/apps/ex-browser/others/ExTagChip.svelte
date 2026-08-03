<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
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
    data-root
    data-outline={outline}
    data-selected={selected}
    class='inline-flex'
    onclick={(e: MouseEvent) => {
      onClicked(e);
    }}
    >
    {#if !decorated}
      <span data-text>{text}</span>
    {:else}
      <span data-hash>#</span>
      <span data-text>{text}</span>
      <span data-close>&times;</span>
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
  font-size: 10px;
  font-weight: 600;
  line-height: 12px;
  font-family: inherit;
  letter-spacing: 0;
  white-space: nowrap;
  cursor: pointer;
  transition-property: background, border-color, color;
  transition-duration: var(--duration-short);
  text-decoration: none;
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

  & [data-hash] {
    opacity: 0.6;
    font-size: 10px;
    margin-right: -2px;
  }

  & [data-close] {
    opacity: 0.55;
    font-size: 15px;
    line-height: 1;
    margin-top: -0.5px;
  }
}
</style>
