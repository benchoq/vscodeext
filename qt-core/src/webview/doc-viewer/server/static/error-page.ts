// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { getScriptToInject } from "./script-to-inject";

export function createErrorPage(code: number) {
  return /*html*/`
    <!DOCTYPE html>
    <html>
      <head>${getScriptToInject()}</head>
      <body data-error-code='${String(code)}'></body>
    </html>
  `;
}
