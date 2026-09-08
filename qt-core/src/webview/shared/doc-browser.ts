// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

export interface IndexData {
  name: string;
  fileId: number;
  anchor: string;
  identifier: string;
  folderName: string,
  fileName: string;
  fileTitle: string;
  namespaceName: string;

  qchFileName: string;
  qchFilePath: string;
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
    typeof o.identifier === 'string' &&
    typeof o.folderName === 'string' &&
    typeof o.fileName === 'string' &&
    typeof o.fileTitle === 'string' &&
    typeof o.namespaceName === 'string' &&
    typeof o.qchFilePath === 'string' &&
     typeof o.qchFileName === 'string'
  );
}
