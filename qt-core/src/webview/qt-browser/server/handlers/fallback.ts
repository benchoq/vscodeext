// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as fs from 'fs';

import { Handler, HandlerContext, sendData, sendNotFound } from './common';

/* eslint-disable @typescript-eslint/class-methods-use-this */
export class FallbackHandler implements Handler {
  public canHandle(): boolean {
    return true;
  }

  public handle(c: HandlerContext) {
    fs.readFile(c.parsed.filePath, (err, data) => {
      if (err) {
        sendNotFound(c);
      } else {
        sendData(c, data);
      }
    });
  }
}
