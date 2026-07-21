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

<div class='panel flex flex-col'>
  <ExCatalogHeader />

  <div class='body flex flex-row'>
    <div class='versions'><ExCatalogQtVersions /></div>
    <div class='categories'><ExCatalogCategories /></div>
  </div>

  <div class='footer flex'>
    <ExCatalogFooter />
  </div>
</div>

<style>
  .panel {
    width: 480px;
    background: var(--qt-bg-subtle);
    border: 1px solid var(--qt-stroke-subtle);
    border-radius: var(--qt-radius-m);
    box-shadow: 0 8px 24px rgba(0,0,0,0.45);
    overflow: hidden;
  }

  .body {
    border-top: 1px solid var(--qt-stroke-subtle);
  }

  .versions {
    width: 160px;
    padding: 6px 0;
  }

  .categories {
    flex: 1;
    max-height: 340px;
    padding: 6px 0;
    overflow-y: auto;
    border-left: 1px solid var(--qt-stroke-subtle);
  }

  .footer {
    border-top: 1px solid var(--qt-stroke-subtle);
    display: flex;
    align-items: center;
    /* gap: 8px; */
    padding: 8px 14px;
    border-top: 1px solid var(--qt-stroke-subtle);
    background: var(--qt-bg-default);
    flex-shrink: 0;
  }
</style>
