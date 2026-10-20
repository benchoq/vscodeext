// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { DocViewerHttpServer } from '../server/http-server';
import { DocViewerBookmarkManager } from './bookmark-manager';
import { DocViewerHistoryManager } from './history-manager';

export interface DocViewerEnv {
  server: DocViewerHttpServer;
  history: DocViewerHistoryManager;
  bookmarks: DocViewerBookmarkManager;
}

export const docViewerEnv: DocViewerEnv = {
  server: new DocViewerHttpServer(),
  history: new DocViewerHistoryManager(),
  bookmarks: new DocViewerBookmarkManager()
};
