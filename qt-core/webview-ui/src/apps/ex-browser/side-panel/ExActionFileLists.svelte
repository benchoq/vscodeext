<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { FileText } from '@/icons';
  import { data, ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  const example = $derived(ui.selected.example);
  const resolvedPaths = $derived.by(() => {
    const id = ui.selected.example?.projectPath;
    return id ? data.resolvedPaths[id] : undefined;
  });

  const projectDir = $derived.by(() => {
    if (!example?.projectPath) {
      return '';
    }

    const full = example?.projectPath
    const index = full.lastIndexOf('/');
    return index === -1 ? '' : full.slice(0, index + 1);
  });

  function shortenPath(filePath: string): string {
    return filePath.startsWith(projectDir)
      ? filePath.slice(projectDir.length)
      : filePath;
  }
</script>

{#if example}
  <div data-comp-root class='flex flex-col'>
    {@render FileButton(shortenPath(example.projectPath), () => {
      viewlogic.runExAction('project-open-file');
    })}

    {#each example.filesToOpen as file (file)}
    {@const exists = (resolvedPaths?.filesToOpen[file] !== undefined)}
    {#if exists}
        {@render FileButton(shortenPath(file), () => {
          viewlogic.runExAction('file-open', { file });
        })}
      {/if}
    {/each}
  </div>
{/if}

{#snippet FileButton(file: string, onClicked: () => void)}
  <button
    data-button
    data-flat
    class='flex flex-row grow'
    onclick={onClicked}
  >
    <FileText />
    {file}
  </button>
{/snippet}


<style>
  [data-comp-root] {
    gap: 0px;
  }

  [data-button] {
    align-items: center;
    gap: 7px;
    padding: 5px 2px;
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

    &[data-flat] {
      color: var(--qt-text-muted);
      background: none;
      padding: 5px 2px;

      &:hover {
        color: var(--qt-accent-info);
      }
    }
  }
</style>
