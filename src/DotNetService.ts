import * as vscode from "vscode";
const { spawn } = require("child_process");
import { FileService } from "./FileService";
import { LoggingService } from "./LoggingService";
import Mutex from "./Mutex";

enum DotNetCommand {
  Build = "build",
  Restore = "restore",
  Test = "test"
}

interface IDotNetProcess {
  command: DotNetCommand;
  keywordPastTense: string;
  keywordPresentTense: string;
  fileNameFilter: string;
}

class BuildProcess implements IDotNetProcess {
  keywordPastTense: string;
  keywordPresentTense: string;
  command: DotNetCommand;
  fileNameFilter: string;

  constructor() {
    this.command = DotNetCommand.Build;
    this.keywordPresentTense = "Build";
    this.keywordPastTense = "Built";
    this.fileNameFilter = "";
  }
}

class RestoreProcess implements IDotNetProcess {
  keywordPastTense: string;
  keywordPresentTense: string;
  command: DotNetCommand;
  fileNameFilter: string;

  constructor() {
    this.command = DotNetCommand.Restore;
    this.keywordPresentTense = "Restore";
    this.keywordPastTense = "Restored";
    this.fileNameFilter = "";
  }
}

class TestProcess implements IDotNetProcess {
  keywordPastTense: string;
  keywordPresentTense: string;
  command: DotNetCommand;
  fileNameFilter: string;

  constructor() {
    this.command = DotNetCommand.Test;
    this.keywordPresentTense = "Test";
    this.keywordPastTense = "Tested";
    this.fileNameFilter = "Test";
  }
}

export class DotNetService {
  mutex: Mutex;
  loggingService: LoggingService;

  constructor(loggingService: LoggingService) {
    this.mutex = new Mutex();
    this.loggingService = loggingService;
  }

  private DotNetLogic(process: IDotNetProcess): void {
    const fileService = new FileService();
    let buildProcess;

    let currentPath: vscode.WorkspaceFolder[] | undefined =
      vscode.workspace.workspaceFolders;

    if (currentPath != undefined) {
      currentPath.forEach((folder: vscode.WorkspaceFolder) => {
        fileService.findAllCsProjFiles(
          folder.uri.fsPath,
          process.fileNameFilter,
          (results: string[]) => {
            let totalBuildsCompleted: number = 0;
            let errorState: boolean = false;
            results.forEach(async (file: string) => {
              const unlock: any = await this.mutex.lock();
              if (!errorState) {
                this.loggingService.logInfo(`Building project file ${file}`);
                buildProcess = spawn("dotnet", [process.command, file]);
                buildProcess.stdout.on("data", (data: any) => {
                  this.loggingService.logInfo(`${data}`);
                });
                buildProcess.stderr.on("data", (data: any) => {
                  this.loggingService.logError(`${data}`);
                });
                buildProcess.on("close", (code: any) => {
                  unlock();
                  this.loggingService.logInfo(
                    `${process.keywordPresentTense} process exited with code ${code}`
                  );
                  if (code !== 0) {
                    vscode.window.showErrorMessage(
                      `${process.keywordPresentTense} for ${file} failed with code ${code}`
                    );
                    errorState = true;
                  } else {
                    totalBuildsCompleted++;
                    if (totalBuildsCompleted == results.length) {
                      vscode.window.showInformationMessage(
                        `Total of ${totalBuildsCompleted} projects ${process.keywordPastTense.toLowerCase()} successfully.`
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

  public BuildAll(): void {
    this.DotNetLogic(new BuildProcess());
  }

  public RestoreAll(): void {
    this.DotNetLogic(new RestoreProcess());
  }

  public TestAll(): void {
    this.DotNetLogic(new TestProcess());
  }
}
