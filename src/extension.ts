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

  let dotnetRestoreAllDisposable = vscode.commands.registerCommand(
    "extension.dotnetRestoreAll",
    () => {
      loggingService.logInfo("Starting 'Restore All' command");

      new DotNetService(loggingService).RestoreAll();
      vscode.window.showInformationMessage(
        "Running restore all on current folder/workspace..."
      );
    }
  );

  context.subscriptions.push(dotnetBuildTestAllDisposable);
  context.subscriptions.push(dotnetBuildAllDisposable);
  context.subscriptions.push(dotnetRestoreAllDisposable);
}

export function deactivate() {}
