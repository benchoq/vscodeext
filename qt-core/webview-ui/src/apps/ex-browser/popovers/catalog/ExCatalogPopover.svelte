<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import ExCatalogHeader from './ExCatalogHeader.svelte';
  import ExCatalogFooter from './ExCatalogFooter.svelte';
  import ExCatalogQtVersions from './ExCatalogQtVersions.svelte';
  import ExCatalogCategories from './ExCatalogCategories.svelte';
</script>

<svelte:options runes={true} />

<div data-comp-root class='flex flex-col'>
  <ExCatalogHeader />

  <div data-section class='flex flex-row'>
    <div data-versions><ExCatalogQtVersions /></div>
    <div data-categories class='flex-1'><ExCatalogCategories /></div>
  </div>

  <div data-section>
    <ExCatalogFooter />
  </div>
</div>

<style>
  [data-comp-root] {
    width: var(--catalog-popup-width);
    background: var(--qt-bg-subtle);
    border: var(--popover-border);
    border-radius: var(--qt-radius-m);
    box-shadow: var(--popover-shadow);
    overflow: hidden;

    & > [data-section] {
      max-height: 340px;
      border-top: var(--catalog-section-separator);

      & > [data-versions] {
        width: 160px;
        padding: 6px 0;
        min-height: 0;
        overflow-y: auto;
      }

      & > [data-categories] {
        border-left: var(--catalog-section-separator);
        padding: 6px 0;
        min-height: 0;
        overflow-y: auto;
      }
    }
  }
</style>
