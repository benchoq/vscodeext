// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

export interface IndexData {
  name: string;
  fileId: number;
  anchor: string;
  identifier: string;
}

export function isIndexData(x: unknown): x is IndexData {
  if (typeof x !== 'object' || x === null) {
    return false;
  }

  const o = x as Record<string, unknown>;
  return (
    typeof o.name === 'string' &&
    typeof o.fileId === 'number' &&
    typeof o.anchor === 'string' &&
    typeof o.identifier === 'string'
  );
}
