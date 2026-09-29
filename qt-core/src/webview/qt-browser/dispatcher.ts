// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';
import {
  env,
  Uri,
  WebviewPanel as Panel,
  ExtensionContext as Context,
} from 'vscode';
import * as path from 'path';

import { WebviewDispatcher } from '@/webview/dispatcher';
import { Command, CommandId } from '@/webview/shared/message';
import { fsFile } from '@/fs-utils';
import { QtBrowserLocalServer } from './local-server';

export class QtBrowserDispatcher extends WebviewDispatcher  {
  public constructor(
    private readonly _extContext: Context,
    private readonly _panel: Panel,
    private readonly _localServer: QtBrowserLocalServer
  ) {
    super('qt-browser', _panel);

    this.setHandlers([
      [CommandId.QtBrowserGetConfig, this._onGetConfig],
      [CommandId.QtBrowserResolveUri, this._onResolveUri]
    ]);

    void this._extContext;
    void this._panel;
  }

  public override dispose() {
    super.dispose();
  }

  private readonly _onGetConfig = (cmd: Command) => {
    this.channel.replyData(cmd, {
      serverOrigin: this._localServer.origin
    });
  };

  private readonly _onResolveUri = (cmd: Command) => {
    const cssPath = path.join(this._extContext.extensionPath, 'res/others/doc-styles.css');
    const cssFile = fsFile(cssPath);
    if (cssFile.exists()) {
      this._localServer.setCssOverride(String(cssFile.readAll()));
    }

    const given = Uri.parse(String(_.get(cmd.payload, 'uri', '')));
    if (given.scheme === 'file') {
      const target = given.with({
        scheme: this._localServer.scheme,
        authority: this._localServer.authority
      })

      this.channel.replyData(cmd, { uri: target.toString() });
    } else if (given.toString().startsWith(this._localServer.origin)) {
      this.channel.replyData(cmd, { uri: given.toString() });
    } else {
      env.openExternal(given);
      // const opt = { viewColumn: ViewColumn.Beside };
      // commands.executeCommand('simpleBrowser.api.open', given, opt);
      this.channel.replyDone(cmd);
    }
  }
}

