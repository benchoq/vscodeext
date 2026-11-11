// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { ExtensionContext } from 'vscode';

import { TmGrammarRegistry } from "./grammar-registry";
import { TmLineStartStateCache } from "./state-cache";

export interface TmInfra {
  registry: TmGrammarRegistry;
  cache: TmLineStartStateCache;
}

export function createTmInfra(context: ExtensionContext): TmInfra {
  return {
    registry: new TmGrammarRegistry(context.extensionPath),
    cache: new TmLineStartStateCache()
  };
}
