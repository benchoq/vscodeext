// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { vscode } from '@/apps/vscode';

import { CommandId } from '@shared/message';
import {
  isTocEntry,
  isIndexMatch,
  isFullTextMatch,
  type HtmlPageInfo,
  isQtDocRootInfo,
  type QtDocRootInfo,
} from '@shared/qt-help';
import { data, ui, type UiMode } from './states.svelte';
import * as docViewer from '../doc-viewer/viewlogic.svelte';

export async function onAppMount() {
  await loadPackages();
  selectPackage(data.packages[0]);
}

export async function onAppDestroy() {
}

export async function loadPackages() {
  const r = await vscode.post(CommandId.QtHelpGetPackages);

  if (Array.isArray(r) && r.every(isQtDocRootInfo)) {
    data.packages = r;
  }
}

export async function selectPackage(p: QtDocRootInfo) {
  if (ui.selected.package === p) {
    return;
  }

  await vscode.post(CommandId.QtHelpSelectPackage, {
    package: $state.snapshot(p)
  });

  ui.selected.package = p;

  await loadToc();
  await loadIndexes();

  const landing = `file://${ui.selected.package.fsPath}/qtdoc/index.html`;
  docViewer.openDoc(landing);
  console.log(landing);
}

export async function loadToc() {
  const r = await vscode.post(CommandId.QtHelpReadToc);

  if (Array.isArray(r) && r.every(isTocEntry)) {
    data.toc = r;
    ui.tocTree.rebuild(r);
  }
}

export async function loadIndexes() {
  const r = await vscode.post(CommandId.QtHelpReadIndexes);

  if (Array.isArray(r) && r.every(isIndexMatch)) {
    data.indexes = r;
    updateFilteredIndex();
  }
}

export async function search(keyword: string) {
  const r = await vscode.post(CommandId.QtHelpSearchFullText, { keyword });
  if (Array.isArray(r) && r.every(isFullTextMatch)) {
    data.fullText = r;
  }

  console.log(r);
}

export async function updateFilteredIndex() {
  const k = ui.index.filter.keyword.trim();
  if (k.length === 0) {
    ui.index.filtered = data.indexes;
    return;
  }

  ui.index.filtered = data.indexes.filter((v) => {
    return (v.name.toLowerCase().indexOf(ui.index.filter.keyword.toLowerCase()) !== -1);
  });
}

export function setMode(mode: UiMode) {
  ui.mode = mode;
}

export async function openHtml(info: HtmlPageInfo) {
  const uri = toFileUri(info);
  if (uri) {
    docViewer.openDoc(uri.toString());
  }
}

export function isCurrentDoc(info: HtmlPageInfo) {
  try {
    const uri = toFileUri(info);
    const currentUri = new URL(docViewer.currentServiceUri());
    return (uri && uri.pathname === currentUri.pathname);
  } catch (e) {
    void e;
    return false;
  }
}

// helpers
function toFileUri(info: HtmlPageInfo) {
  if (!ui.selected.package) {
    return undefined;
  }

  const url = new URL('file://');
  url.pathname = `${ui.selected.package.fsPath}/${info.filePathRel}`;
  url.hash = info.anchor ?? '';

  return url;
}
