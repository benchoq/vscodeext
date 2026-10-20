// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';
import * as path from 'path';
import {
  env,
  Uri,
  Disposable,
  WebviewPanel as Panel,
  ExtensionMode as ExtMode,
  ExtensionContext as ExtContext,
} from 'vscode';

import {
  isHistoryEdit,
  isBookmarkEdit,
  OpenOptions,
  UiState
} from '@/webview/shared/doc-viewer';
import { fsFile } from '@/fs-utils';
import { WebviewDispatcher } from '@/webview/dispatcher';
import { Command, CommandId } from '@/webview/shared/message';
import { DocViewerInfra } from './infra';
import { openDocViewer } from './controller';

export class DocViewerDispatcher extends WebviewDispatcher  {
  private readonly _viewerState: UiState = {};
  private readonly _disposable: Disposable | undefined;

  public constructor(
    private readonly _extContext: ExtContext,
    private readonly _panel: Panel,
    private readonly _infra: DocViewerInfra,
    private readonly _openOptions: OpenOptions
  ) {
    super(
      _openOptions.trigger === 'qt-help' ? 'qt-help' : 'doc-viewer',
      _panel
    );

    this.setHandlers([
      [CommandId.DocViewerGetConfig, this._onGetConfig],
      [CommandId.DocViewerSetViewerState, this._onSetViewerState],
      [CommandId.DocViewerOpenDoc, this._onOpenDoc],
      [CommandId.DocViewerGetBookmarks, this._onGetBookmarks],
      [CommandId.DocViewerEditBookmarks, this._onEditBookmarks],
      [CommandId.DocViewerGetHistories, this._onGetHistories],
      [CommandId.DocViewerEditHistories, this._onEditHistories],
    ]);

    const cssPath = path.join(
      this._extContext.extensionPath,
      'res/others',
      'qt-doc-styles.css'
    );

    const css = this._infra.server.cssManager();
    css.setCssPath(cssPath);

    if (this._extContext.extensionMode === ExtMode.Development) {
      this._disposable = css.onCssChanged(() => {
        this.channel.notify(CommandId.DocViewerReloadPage);
      });
    }
  }

  public override dispose() {
    this._disposable?.dispose();
    super.dispose();
  }

  public get currentUri() {
    return this._viewerState.uri;
  }

  private readonly _onGetConfig = (cmd: Command) => {
    this.channel.replyData(cmd, {
      openOptions: this._openOptions,
      serverOrigin: this._infra.server.baseUri.toString(),
    });
  };

  private readonly _onSetViewerState = (cmd: Command) => {
    this._viewerState.uri = String(_.get(cmd.payload, 'uri', ''));
    this._viewerState.title = String(_.get(cmd.payload, 'title', ''));

    if (this._openOptions.syncPanelTitle === true) {
      this._panel.title = this._viewerState.title;
    }

    this.channel.replyDone(cmd);
  }

  private readonly _onOpenDoc = (cmd: Command) => {
    const uri_s = String(_.get(cmd.payload, 'uri', ''));
    const newWindow = Boolean(_.get(cmd.payload, 'forceNewWindow', false));

    try {
      const parsed = Uri.parse(uri_s, true);
      const redirect = this._infra.server.getRedirectUri(parsed);

      if (this._infra.server.matchesOrigin(redirect)) {
        if (!fsFile(redirect.path).exists()) {
          this.channel.replyData(cmd, {
            uri_s,
            status: 'qt-doc:not-exists',
            errorCode: '404',
            errorUri: redirect.toString(),
          });
          return;
        }

        if (newWindow) {
          const openOptions: OpenOptions = {
            trigger: this._openOptions.trigger,
            syncPanelTitle: true,
            forceNewWindow: true
          };

          void openDocViewer(redirect, openOptions);
          this.channel.replyData(cmd, {
            uri_s,
            status: 'qt-doc:valid-in-new-window'
          });
        } else {
          this.channel.replyData(cmd, {
            uri_s,
            serviceUri: redirect.toString(),
            status: 'qt-doc:valid'
          });
        }
      } else {
        env.openExternal(parsed);
        this.channel.replyData(cmd, { uri_s, status: 'url-external' });
      }
    } catch {
      this.channel.replyData(cmd, { uri_s, status: 'url-invalid'});
    }
  }

  private readonly _onGetBookmarks = (cmd: Command) => {
    this.channel.replyData(cmd, {
      entries: this._infra.bookmarks.entries
    });
  }

  private readonly _onEditBookmarks = async (cmd: Command) => {
    const edit = _.get(cmd.payload, 'edit', {});
    if (!isBookmarkEdit(edit)) {
      return;
    }

    const affected = this._infra.bookmarks.edit(edit);
    if (affected) {
      await this._infra.bookmarks.save();
    }

    this.channel.replyData(cmd, {
      entries: this._infra.bookmarks.entries
    });
  }

  private readonly _onGetHistories = (cmd: Command) => {
    this.channel.replyData(cmd, {
      entries: this._infra.history.entries
    });
  }

  private readonly _onEditHistories = async (cmd: Command) => {
    const edit = _.get(cmd.payload, 'edit', {});
    if (!isHistoryEdit(edit)) {
      return;
    }

    const affected = this._infra.history.edit(edit);
    if (affected) {
      await this._infra.history.save();
    }

    this.channel.replyData(cmd, {
      entries: this._infra.history.entries
    });
  }
}
