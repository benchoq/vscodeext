// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as fs from 'fs';

import { getScriptToInject } from './script-to-inject';
import { Handler, HandlerContext, sendData, sendNotFound } from './common';

/* eslint-disable @typescript-eslint/class-methods-use-this */
export class ScriptInjectionHandler implements Handler {
  public canHandle(c: HandlerContext): boolean {
    return c.parsed.fileName.endsWith('.html');
  }

  public handle(c: HandlerContext) {
    fs.readFile(c.parsed.filePath, (err, data) => {
      if (err) {
        sendNotFound(c);
        return;
      }

      sendData(c, String(data).replace(
        '</body>',
        `${getScriptToInject()}</body>`
      ));
    });
  }
}
