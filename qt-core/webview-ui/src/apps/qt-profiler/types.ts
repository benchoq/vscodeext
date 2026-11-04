
// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

interface RpcEventSelected {
  jsonrpc: '2.0',
  method: 'traceEventSelected',
  params: {
    columnNumber: number,
    lineNumber: number,
    sourceFilePath: string
  }
}

interface RpcLoadingStarted {
  jsonrpc: '2.0',
  method: 'traceFileLoadingStarted',
  params: {
    traceFilePath: string
  }
}

interface RpcLoadingFinished {
  jsonrpc: '2.0',
  method: 'traceFileLoadingFinished',
  params: {
    successful: boolean,
    errorMessage: string,
    traceFilePath: string
  }
}

type RpcOutput =
  | RpcEventSelected
  | RpcLoadingStarted
  | RpcLoadingFinished
;

export function isRpcOutput(msg: unknown): msg is RpcOutput {
  if (!isRecord(msg) || msg.jsonrpc !== '2.0' || !isRecord(msg.params)) {
    return false;
  }

  const p = msg.params;
  switch (msg.method) {
    case 'traceEventSelected':
      return typeof p.sourceFilePath === 'string'
        && typeof p.lineNumber === 'number'
        && typeof p.columnNumber === 'number';

    case 'traceFileLoadingStarted':
      return typeof p.traceFilePath === 'string';

    case 'traceFileLoadingFinished':
      return typeof p.successful === 'boolean'
        && typeof p.errorMessage === 'string'
        && typeof p.traceFilePath === 'string';

    default:
      return false;
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}
