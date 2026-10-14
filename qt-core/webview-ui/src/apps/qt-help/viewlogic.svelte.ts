// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';

import { vscode } from '@/apps/vscode';
import { CommandId } from '@shared/message';
import {
  isTocEntry,
  isIndexMatch,
  isFullTextMatch,
  isQtDocRootInfo,
  type HtmlPageInfo,
  type QtDocRootInfo,
  type IndexMatch,
  type ParsedTitle
} from '@shared/qt-help';
import { data, ui, type UiMode } from './states.svelte';
import * as docViewer from '../doc-viewer/viewlogic.svelte';
import type { IndexOrHeader } from './types.svelte';

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
  if (!Array.isArray(r) || !r.every(isIndexMatch)) {
    return;
  }

  data.indexes = sortIndexes(r);
  ui.index.modified = modifyIndexList(data.indexes);
  updateFilteredIndex();
}

export async function search(keyword: string) {
  const task = async () => {
    const r = await vscode.post(CommandId.QtHelpSearchFullText, { keyword });
    const result = _.get(r, 'result', []);

    if (Array.isArray(result) && result.every(isFullTextMatch)) {
      data.search.result = result;
      data.search.keyword = String(_.get(r, 'keyword', keyword)).trim();
    }
  }

  await ui.task.run(task, { debounceTime_ms: 50 });
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

function sortIndexes(raw: IndexMatch[]) {
  const isSpecial = (s: string) => !/^[a-z0-9]/i.test(s);
  return raw.sort((a, b) => {
    const sa = isSpecial(a.name);
    const sb = isSpecial(b.name);
    if (sa !== sb) {
      return sa ? 1 : -1;
    }

    return a.name.localeCompare(b.name);
  });
}

function modifyIndexList(raw: IndexMatch[]) {
  const result: IndexOrHeader[] = [];

  for (let i = 0; i < raw.length; ++i) {
    const data = raw[i];
    const samePrev = raw[i - 1]?.name === data.name;
    const sameNext = raw[i + 1]?.name === data.name;

    if (!samePrev && sameNext) {
      result.push({
        type: 'section-header',
        display: data.name
      });
    }

    const type = (!samePrev && !sameNext) ? 'item' : 'section-item';
    const parsedTitle = parseTitle(data.page.title);
    const display = (type === 'item')
      ? data.name
      : parsedTitle.title;

    result.push({ type, data, display, parsedTitle });
  }

  return result;
}

const QT_MODULE_RE = /^Qt\s+\S/;
const QT_VERSION_RE = /^Qt\s+(\d+(?:\.\d+)*)$/;

function parseTitle(s: string): ParsedTitle {
  const [first = '', ...rest] = s
    .split('|')
    .map((p) => p.trim());

  const titleParts = [first];
  let module: string | undefined;
  let version: string | undefined;

  for (const p of rest) {
    const v = QT_VERSION_RE.exec(p);
    if (v && !version) {
      version = v[1];
    } else if (!module && QT_MODULE_RE.test(p)) {
      module = p;
    } else {
      titleParts.push(p);
    }
  }

  return {
    title: titleParts.join(' | '),
    module,
    version
  };
};
