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
import { DocViewerHttpServer } from './server/http-server';
import * as consts from './constants';

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
      _openOptions.origin === 'qt-help' ? 'qt-help' : 'doc-viewer',
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

    const css = this._infra.server.cssManager();
    css.setCssPath(path.join(
      this._extContext.extensionPath,
      consts.CssSubDir,
      consts.CssFileName
    ));

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
    const res = resolveDoc(
      String(_.get(cmd.payload, 'uri', '')),
      Boolean(_.get(cmd.payload, 'newViewer', false)),
      this._infra.server
    );

    if (res.result === 'open') {
      if (res.target === 'external') {
        void env.openExternal(res.uri);
      } else {
        void openDocViewer(res.uri, {
          origin: this._openOptions.origin,
          syncPanelTitle: true,
          forceNewWindow: true,
        });
      }
    }

    this.channel.replyData(cmd, res);
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

// helpers
type ResolveDocResult =
  | { result: 'load'; serviceUri: string }
  | { result: 'error'; errorCode: string }
  | { result: 'open'; target: 'external' | 'newViewer'; uri: Uri };

function resolveDoc(
  uri_s: string,
  newWindow: boolean,
  server: DocViewerHttpServer
): ResolveDocResult {
  let uri: Uri;

  try {
    uri = Uri.parse(uri_s, true);
  } catch {
    return { result: 'error', errorCode: '400' };
  }

  const redirect = server.getRedirectUri(uri);
  const isLocalFile = server.matchesOrigin(redirect);

  if (!isLocalFile) {
    return { result: 'open', target: 'external', uri };
  }

  if (!fsFile(redirect.path).exists()) {
    return { result: 'error', errorCode: '404' };
  }

  if (newWindow) {
    return { result: 'open', target: 'newViewer', uri: redirect };
  }

  return { result: 'load', serviceUri: redirect.toString() };
}
