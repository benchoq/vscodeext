// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';
import {
  env,
  Uri,
  WebviewPanel as Panel,
  ExtensionContext as Context,
} from 'vscode';

import { WebviewDispatcher } from '@/webview/dispatcher';
import { Command, CommandId } from '@/webview/shared/message';
import { QtBrowserLocalServer } from './server/local-server';

export class QtBrowserDispatcher extends WebviewDispatcher  {
  public constructor(
    private readonly _extContext: Context,
    private readonly _panel: Panel,
    private readonly _localServer: QtBrowserLocalServer
  ) {
    super('qt-browser', _panel);

    this.setHandlers([
      [CommandId.QtBrowserGetConfig, this._onGetConfig],
      [CommandId.QtBrowserSetTitle, this._onSetTitle],
      [CommandId.QtBrowserOpenUriExt, this._onOpenUriExt],
    ]);

    void this._extContext;
    void this._panel;
  }

  public override dispose() {
    super.dispose();
  }

  public notifyReload() {
    this.channel.notify(CommandId.QtBrowserReloadPage);
  }

  private readonly _onGetConfig = (cmd: Command) => {
    this.channel.replyData(cmd, {
      serverOrigin: this._localServer.origin
    });
  };

  private readonly _onSetTitle = (cmd: Command) => {
    this._panel.title = String(_.get(cmd.payload, 'title', ''));;
    this.channel.replyDone(cmd);
  }

  private readonly _onOpenUriExt = (cmd: Command) => {
    env.openExternal(Uri.parse(String(_.get(cmd.payload, 'uri', ''))));
    this.channel.replyDone(cmd);
  }
}

// file:///Users/bencho/tools/Qt/Docs/Qt-6.11.1/qtdoc/qtdoc-demos-car-configurator-example.html#running-the-example