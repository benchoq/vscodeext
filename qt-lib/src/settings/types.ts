// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  workspace,
  ConfigurationTarget,
  WorkspaceConfiguration
} from 'vscode';

export class QtExtSettingItem<T = unknown> {
  constructor(
    private readonly _extId: string,
    private readonly _key: string,
  ) {}

  public get(): T | undefined;
  public get(defaultValue: T): T;
  public get(defaultValue?: T) {
    return this._config.get<T>(this._key, defaultValue as T);
  }

  public update(
    value: T | undefined,
    target?: ConfigurationTarget | boolean | null,
    overrideInLanguage?: boolean,
  ): Thenable<void> {
    return this._config.update(this._key, value, target, overrideInLanguage);
  }

  private get _config(): WorkspaceConfiguration {
    return workspace.getConfiguration(this._extId);
  }
}
