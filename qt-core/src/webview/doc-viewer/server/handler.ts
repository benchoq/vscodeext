// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as fs from 'fs';

import { getScriptToInject } from './script-to-inject';
import { type HttpContext, sendData, sendNotFound  } from './common';

export type HandlerFunc = (c: HttpContext) => boolean;

export function replaceCss(c: HttpContext, css: string) {
  if (!c.req.fileName.startsWith('offline')
    || !c.req.fileName.endsWith('.css')) {
    return false;
  }

  sendData(c, css);
  return true;
}

export function injectScriptToHtml(c: HttpContext) {
  if (!c.req.fileName.endsWith('.html')) {
    return false;
  }

  fs.readFile(c.req.filePath, (err, data) => {
    if (err) {
      sendNotFound(c);
      return;
    }

    sendData(c, String(data).replace(
      '</body>',
      `${getScriptToInject()}</body>`
    ));
  });

  return true;
}

export function handleFallback(c: HttpContext) {
  fs.readFile(c.req.filePath, (err, data) => {
    if (err) {
      sendNotFound(c);
      return;
    }

    sendData(c, data);
  });

  return true;
}
