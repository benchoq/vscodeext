// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

export const NotFoundPage = /*html*/`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Not found</title>
  <style>
    html, body {
      height: 100%;
      margin: 0;
    }

    body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 24px;
      box-sizing: border-box;
      color: var(--vscode-foreground);
      font-family: var(--vscode-font-family);
      text-align: center;
    }

    h1 {
      margin: 0;
      font-size: 64px;
      font-weight: 600;
      line-height: 1;
      opacity: 0.6;
    }

    p {
      margin: 0;
      font-size: 16px;
    }

    button {
      padding: 6px 16px;
      border: none;
      border-radius: 2px;
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      cursor: pointer;
    }

    button:hover {
      background: var(--vscode-button-hoverBackground);
    }

    code {
      max-width: 100%;
      overflow-wrap: anywhere;
      font-family: var(--vscode-editor-font-family);
      font-size: 12px;
      opacity: 0.7;
    }
  </style>
</head>
<body>
  <h1>404</h1>
  <p>Page not found</p>
  <button type="button" onclick="history.back()">Go back</button>
  <code id="url"></code>

  <script>
    document.getElementById('url').textContent = location.href;
  </script>
</body>
</html>
`