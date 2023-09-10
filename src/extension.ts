import * as vscode from "vscode";

import { ACTIVATE_COMMAND } from "./extension/commands";
import { activatePanel } from "./extension/panel";

export function activate(context: vscode.ExtensionContext) {
  const panelCommand = vscode.commands.registerCommand(ACTIVATE_COMMAND, () => {
    activatePanel(context);
  });

  context.subscriptions.push(panelCommand);
}

export function deactivate() {
  console.log("deactivated");
}
