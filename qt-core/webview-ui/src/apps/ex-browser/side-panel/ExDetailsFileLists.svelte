<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { data, ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  const example = $derived(ui.selected.example);
  const filesSorted = $derived.by(() => {
    return [...(example?.filesToOpen ?? [])].sort();
  })
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

    {#each filesSorted as file (file)}
    {@const exists = resolvedPaths?.filesToOpen[file] !== undefined}
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
    class='flex flex-row grow'
    onclick={onClicked}
  >
    {file}
  </button>
{/snippet}

<style>
  [data-comp-root] {
    gap: 0px;
  }

  [data-button] {
    color: var(--qt-text-default);
    background: none;
    line-height: 18px;
    word-break: break-word;

    border: none;
    font-family: inherit;
    font-size: 11px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;

    &:hover {
      color: var(--qt-accent-info);
    }
  }
</style>
