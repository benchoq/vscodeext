// Copyright (C) 2024 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as child_process from 'child_process';

export class DesignerClient {
  private process: child_process.ChildProcess | undefined;
  private readonly designerExePath: string;
  private readonly serverPort: number | undefined;
  constructor(designerExePath: string, serverPort?: number) {
    this.serverPort = serverPort;
    this.designerExePath = designerExePath;
  }

  public start(serverPort?: number) {
    const designerExePath = this.designerExePath;
    const designerServerPort = serverPort ?? this.serverPort;
    if (!designerServerPort) {
      throw new Error('Designer server port is not set');
    }

    if (designerExePath) {
      this.process = child_process
        .spawn(designerExePath, ['--client ' + designerServerPort.toString()], {
          shell: true
        })
        .on('exit', (number) => {
          this.process = undefined;
          console.log('Designer client exited with code:' + number);
        })
        .on('error', () => {
          this.process = undefined;
          const message =
            'Failed to start designer client:' +
            'Exe:' +
            designerExePath +
            'Port:' +
            designerServerPort;
          throw new Error(message);
        });
    }
  }

  public isRunning() {
    return this.process !== undefined;
  }

  public stop() {
    if (this.process) {
      this.process.kill();
    }
  }

  public dispose() {
    this.stop();
  }
}