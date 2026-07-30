<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { type ExActionTypes } from "@shared/ex-browser";
  import * as chars from '@/utils/chars'
  import { Folder, FileTag } from '@/icons';
  import * as viewlogic from '../viewlogic.svelte';

  function onClicked(a: ExActionTypes) {
    // TODO: supply args
    viewlogic.runExAction(a);
  }

</script>

<div data-comp-root class='flex flex-col'>
  {@render LinkButton('file-open', FileTag, 'CMakeLists.txt',)}
  {@render LinkButton('project-reveal', Folder, 'Show in Finder')}
</div>

{#snippet LinkButton(a: ExActionTypes, Icon: typeof Folder, text: string)}
  <button
    data-link
    class='flex flex-row'
    onclick={() => {
      onClicked(a);
    }}
  >
    <Icon size={14} />
    <span>{text}</span>
    <span data-chevron>{chars.rightChevron}</span>
  </button>
{/snippet}

<style>
  [data-comp-root] {
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
  }
</style>
