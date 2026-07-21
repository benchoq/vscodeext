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
    width: var(--catalog-panel-width);
    background: var(--qt-bg-subtle);
    border: var(--popup-border);
    border-radius: var(--qt-radius-m);
    box-shadow: var(--popup-shadow);
    overflow: hidden;
  }

  .body {
    border-top: var(--catalog-section-separator);
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
    border-left: var(--catalog-section-separator);
  }

  .footer {
    border-top: var(--catalog-section-separator);
    display: flex;
    align-items: center;
    padding: 8px 14px;
    background: var(--qt-bg-default);
    flex-shrink: 0;
  }
</style>
