// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { data } from './states.svelte';

export function toDisplayUri(uri: string) {
  return toFileUri(uri);
}
export function toPersistentUri(uri: string) {
  return toFileUri(uri);
}

export function extractHash(uri: string) {
  try {
    const u = new URL(uri);
    return u.hash;
  } catch (e) {
    void e;
  }

  return '';
}

function toFileUri(uri: string) {
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
