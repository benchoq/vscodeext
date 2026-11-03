// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

export type QmlTraceCommandReply =
  | { status: 'done' }
  | { folders: string[] }
  | { filePath: string; additionalDirs: string[] }
  | { filePath: string; bytes: Uint8Array }
  | {
      fileName: string;
      filePath: string;
      fileUri: string;
      additionalDirs: string[];
      distDir: string;
    };
