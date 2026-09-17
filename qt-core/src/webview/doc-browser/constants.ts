// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as vscode from 'vscode';

import { EXTENSION_ID } from '@/constants';

export const COMMAND_OPEN = 'documentationOpenBrowser';
export const COMMAND_FULL_OPEN = `${EXTENSION_ID}.${COMMAND_OPEN}`;

export const WEBVIEW_PANEL_COLUMN = vscode.ViewColumn.One;
export const WEBVIEW_PANEL_VIEW_TYPE = 'ViewTypeDocBrowser';
