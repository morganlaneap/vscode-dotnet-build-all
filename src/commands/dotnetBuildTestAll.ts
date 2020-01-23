import * as vscode from "vscode";
const { spawn } = require("child_process");
import { findAllCsProjFiles } from "../helpers/fileHelper";

function dotnetBuildTestAll() {
  let currentPath: vscode.WorkspaceFolder[] | undefined =
    vscode.workspace.workspaceFolders;

  if (currentPath != undefined) {
    currentPath.forEach((folder: vscode.WorkspaceFolder) => {
      findAllCsProjFiles(folder.uri.fsPath, (results: string[]) => {
        results.forEach((file: string) => {
          // Run builder
        });
      });
    });
  }
}

export default dotnetBuildTestAll;
