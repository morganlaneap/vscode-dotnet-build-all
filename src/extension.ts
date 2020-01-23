import * as vscode from "vscode";
import dotnetBuildAll from "./commands/dotnetBuildAll";

export function activate(context: vscode.ExtensionContext) {
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
      dotnetBuildAll();
      vscode.window.showInformationMessage(
        "Running build all on current folder/workspace..."
      );
    }
  );

  context.subscriptions.push(dotnetBuildTestAllDisposable);
  context.subscriptions.push(dotnetBuildAllDisposable);
}

export function deactivate() {}
