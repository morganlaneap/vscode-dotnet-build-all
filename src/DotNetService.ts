import * as vscode from "vscode";
const { spawn } = require("child_process");
import { FileService } from "./FileService";
import { LoggingService } from "./LoggingService";
import Mutex from "./Mutex";

export class DotNetService {
  mutex: Mutex;
  loggingService: LoggingService;

  constructor(loggingService: LoggingService) {
    this.mutex = new Mutex();
    this.loggingService = loggingService;
  }

  public BuildAll(): void {
    const fileService = new FileService();
    let buildProcess;

    let currentPath: vscode.WorkspaceFolder[] | undefined =
      vscode.workspace.workspaceFolders;

    if (currentPath != undefined) {
      currentPath.forEach((folder: vscode.WorkspaceFolder) => {
        fileService.findAllCsProjFiles(
          folder.uri.fsPath,
          (results: string[]) => {
            let totalBuildsCompleted: number = 0;
            let errorState: boolean = false;

            results.forEach(async (file: string) => {
              const unlock: any = await this.mutex.lock();

              if (!errorState) {
                this.loggingService.logInfo(`Building project file ${file}`);

                buildProcess = spawn("dotnet", ["build", file]);

                buildProcess.stdout.on("data", (data: any) => {
                  this.loggingService.logInfo(`${data}`);
                });

                buildProcess.stderr.on("data", (data: any) => {
                  this.loggingService.logError(`${data}`);
                });

                buildProcess.on("close", (code: any) => {
                  unlock();

                  this.loggingService.logInfo(
                    `Build process exited with code ${code}`
                  );

                  if (code !== 0) {
                    vscode.window.showErrorMessage(
                      `Build for ${file} failed with code ${code}`
                    );
                    errorState = true;
                  } else {
                    totalBuildsCompleted++;
                    if (totalBuildsCompleted == results.length) {
                      vscode.window.showInformationMessage(
                        `Total of ${totalBuildsCompleted} projects built successfully.`
                      );
                    }
                  }
                });
              } else {
                unlock();
              }
            });
          }
        );
      });
    }
  }
}
