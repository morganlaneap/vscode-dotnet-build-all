import * as vscode from "vscode";
import { DotNetService } from "./DotNetService";
import { LoggingService } from "./LoggingService";

export function activate(context: vscode.ExtensionContext) {
  const loggingService = new LoggingService();

  let dotnetBuildTestAllDisposable = vscode.commands.registerCommand(
    "extension.dotnetBuildTestAll",
    () => {
      // TODO: implement this
      vscode.window.showInformationMessage("This isn't implemented yet!");
    }
  );

  let dotnetBuildAllDisposable = vscode.commands.registerCommand(
    "extension.dotnetBuildAll",
    () => {
      loggingService.logInfo("Starting 'Build All' command");

      new DotNetService(loggingService).BuildAll();
      vscode.window.showInformationMessage(
        "Running build all on current folder/workspace..."
      );
    }
  );

  context.subscriptions.push(dotnetBuildTestAllDisposable);
  context.subscriptions.push(dotnetBuildAllDisposable);
}

export function deactivate() {}
