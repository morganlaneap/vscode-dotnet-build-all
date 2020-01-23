// Borrowed from: https://github.com/prettier/prettier-vscode/blob/master/src/LoggingService.ts <3

// tslint:disable-next-line: no-implicit-dependencies
import { window } from "vscode";

type LogLevel = "INFO" | "WARN" | "ERROR";

export class LoggingService {
  private outputChannel = window.createOutputChannel(".NET Builder");

  /**
   * Append messages to the output channel and format it with a title
   *
   * @param message The message to append to the output channel
   */
  public logInfo(message: string): void {
    this.logMessage(message, "INFO");
  }

  /**
   * Append messages to the output channel and format it with a title
   *
   * @param message The message to append to the output channel
   */
  public logWarning(message: string): void {
    this.logMessage(message, "WARN");
  }

  public logError(message: string, error?: Error | string) {
    this.logMessage(message, "ERROR");
    if (error instanceof Error) {
      if (error.message) {
        this.outputChannel.appendLine(error.message);
      }
      if (error.stack) {
        this.outputChannel.appendLine(error.stack);
      }
    } else if (error) {
      this.outputChannel.appendLine(error);
    }
  }

  public show() {
    this.outputChannel.show();
  }

  /**
   * Append messages to the output channel and format it with a title
   *
   * @param message The message to append to the output channel
   */
  private logMessage(message: string, logLevel: LogLevel): void {
    const title = new Date().toLocaleTimeString();
    this.outputChannel.appendLine(`["${logLevel}" - ${title}] ${message}`);
  }
}
