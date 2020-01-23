import * as vscode from "vscode";
const { spawn } = require("child_process");
import { findAllCsProjFiles } from "../helpers/fileHelper";
import Mutex from "../mutex";

function dotnetBuildAll() {
  const mutex = new Mutex();
  let buildProcess;

  let currentPath: vscode.WorkspaceFolder[] | undefined =
    vscode.workspace.workspaceFolders;

  if (currentPath != undefined) {
    currentPath.forEach((folder: vscode.WorkspaceFolder) => {
      findAllCsProjFiles(folder.uri.fsPath, (results: string[]) => {
        let totalBuildsCompleted = 0;
        results.forEach(async (file: string) => {
          const unlock: any = await mutex.lock();

          console.log(`Building project file ${file}`);
          buildProcess = spawn("dotnet", ["build", file]);
          buildProcess.stdout.on("data", (data: any) => {
            console.log(`${data}`);
          });
          buildProcess.stderr.on("data", (data: any) => {
            console.log(`${data}`);
          });
          buildProcess.on("close", (code: any) => {
            unlock();
            totalBuildsCompleted++;
            console.log(`Build process exited with code ${code}`);

            if (totalBuildsCompleted == results.length) {
              vscode.window.showInformationMessage(
                "All projects built successfully."
              );
            }
          });
        });
      });
    });
  }
}

export default dotnetBuildAll;
