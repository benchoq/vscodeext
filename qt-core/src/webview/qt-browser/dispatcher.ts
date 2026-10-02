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
import { QtBrowserBookmarkManager } from './bookmark-manager';
import { isBookmarkEdit } from '../shared/qt-browser';

export class QtBrowserDispatcher extends WebviewDispatcher  {
  private _homeUri = '';
  private _currentUri = '';
  private readonly _bookmarks: QtBrowserBookmarkManager;

  public constructor(
    private readonly _extContext: Context,
    private readonly _panel: Panel,
    private readonly _localServer: QtBrowserLocalServer
  ) {
    super('qt-browser', _panel);

    this._bookmarks = new QtBrowserBookmarkManager(this._extContext.globalState);
    this.setHandlers([
      [CommandId.QtBrowserGetConfig, this._onGetConfig],
      [CommandId.QtBrowserSetTitle, this._onSetTitle],
      [CommandId.QtBrowserSetCurrentUri, this._onSetCurrentUri],
      [CommandId.QtBrowserOpenUriExt, this._onOpenUriExt],
      [CommandId.QtBrowserGetBookmarks, this._onGetBookmarks],
      [CommandId.QtBrowserEditBookmarks, this._onRunBookmarkEdit],
    ]);

    void this._extContext;
    void this._panel;
  }

  public override dispose() {
    super.dispose();
  }

  public get currentUri() {
    return this._currentUri;
  }

  public setHomeUri(uri: string) {
    this._homeUri = uri;
  }

  public notifyReload() {
    this.channel.notify(CommandId.QtBrowserReloadPage);
  }

  private readonly _onGetConfig = (cmd: Command) => {
    this.channel.replyData(cmd, {
      homeUri: this._homeUri,
      serverOrigin: this._localServer.origin,
    });
  };

  private readonly _onSetTitle = (cmd: Command) => {
    this._panel.title = String(_.get(cmd.payload, 'title', ''));;
    this.channel.replyDone(cmd);
  }

  private readonly _onSetCurrentUri = (cmd: Command) => {
    this._currentUri = String(_.get(cmd.payload, 'uri', ''));;
    this.channel.replyDone(cmd);
  }

  private readonly _onOpenUriExt = (cmd: Command) => {
    env.openExternal(Uri.parse(String(_.get(cmd.payload, 'uri', ''))));
    this.channel.replyDone(cmd);
  }

  private readonly _onGetBookmarks = (cmd: Command) => {
    this.channel.replyData(cmd, { entries: this._bookmarks.entries });
  }

  private readonly _onRunBookmarkEdit = (cmd: Command) => {
    const edit = _.get(cmd.payload, 'edit', {});
    if (!isBookmarkEdit(edit)) {
      return;
    }

    const affected = this._bookmarks.edit(edit);
    if (affected) {
      this._bookmarks.save();
    }

    this.channel.replyData(cmd, { entries: this._bookmarks.entries });
  }
}

/*
file:///Users/bencho/tools/Qt/Docs/Qt-6.11.1/qtdoc/qtdoc-demos-car-configurator-example.html#running-the-example
*/
