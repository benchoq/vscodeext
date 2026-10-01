// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { ViewerMessageId } from '@shared/qt-browser';
import { data, ui } from './states.svelte';

export function findBookmarkSelectedEntries() {
  return data.bookmarks
    .filter((e) => e.checked)
    .map(e => e.data);
}

export function postToViewer(id: ViewerMessageId, data = {}) {
  ui.iframe.el?.contentWindow?.postMessage(
    { id, ...data }, '*'
  );
}

export function toLocalServerUri(uri: string) {
  if (uri.startsWith('file:')) {
    try {
      const u = new URL(uri);
      return `${data.configs.serverOrigin}${u.pathname}${u.hash}`;
    } catch (e) {
      void e;
    }
  }

  return uri;
}

export function toFileUri(uri: string) {
  if (uri.startsWith(data.configs.serverOrigin)) {
    try {
      const u = new URL(uri);
      return `file://${u.pathname}${u.hash}`;
    } catch (e) {
      void e;
    }
  }

  return uri;
}
