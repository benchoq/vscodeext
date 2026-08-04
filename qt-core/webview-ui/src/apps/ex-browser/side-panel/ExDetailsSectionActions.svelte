<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import ExToolButton from '../others/ExToolButton.svelte';
  import { FolderOpen, ChevronRight, FileTag, ExtLink } from '@/icons';
  import * as viewlogic from '../viewlogic.svelte';
</script>

<div data-comp-root class='flex flex-col'>
  <button
    data-button
    data-primary
    class='flex flex-row'
    onclick={() => {
      viewlogic.runExAction('project-open');
    }}
  >
    <FolderOpen size={14} />
    Open example
  </button>

  <button
    data-button
    class='flex flex-row'
    onclick={() => {
    }}
  >
    <ChevronRight size={14} />
    Use as a template
  </button>

  <div class='flex flex-row items-center justify-center'>
    <button
      data-button
      data-flat
      class='flex flex-row grow'
      onclick={() => {
        viewlogic.runExAction('doc-open-internal');
      }}
    >
      <FileTag />
      Read the documentation
      <div class='grow'></div>
    </button>

    <ExToolButton
      onClicked={() => {
        viewlogic.runExAction('doc-open-external');
      }}
    >
      <ExtLink size={12}/>
    </ExToolButton>
  </div>
</div>

<style>
  [data-comp-root] {
    gap: 6px;
  }

  [data-button] {
    align-items: center;
    gap: 7px;
    padding: 5px 11px;
    color: var(--qt-button-secondary-fg);
    background: var(--qt-button-secondary-bg);
    border: none;
    font-family: inherit;
    font-size: 12px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;

    &:hover {
      background: var(--qt-button-secondary-hover);
    }

    &[data-primary] {
      color: var(--qt-button-fg);
      background: var(--qt-button-primary-bg);

      &:hover {
        background: var(--qt-button-primary-hover);
      }
    }

    &[data-flat] {
      color: var(--qt-text-muted);
      background: none;
      padding: 5px 2px;

      &:hover {
        color: var(--qt-accent-info);
      }
    }
  }
  /* [data-comp-root] {
    & > [data-link] {
      align-items: center;
      gap: 7px;
      width: 100%;
      padding: 5px 2px;
      background: none;
      border: none;
      color: var(--qt-text-muted);
      font-family: inherit;
      font-size: 12px;
      cursor: pointer;
      text-align: left;
      border-radius: 3px;
      transition: color var(--duration-short);

      &:hover {
        color: var(--qt-accent-info);
      }

      [data-chevron] {
        margin-left: auto;
        opacity: 0.5;
        font-size: 14px;
      }
    }
  } */
</style>
