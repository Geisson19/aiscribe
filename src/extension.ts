import * as vscode from "vscode";
// import { createDoc } from "./extension/functions";
import { CREATE_DOC_COMMAND, ACTIVATE_COMMAND } from "./extension/commands";
import { activatePanel } from "./extension/panel";

export function activate(context: vscode.ExtensionContext) {
  // const makeDocCommand = vscode.commands.registerCommand(
  //   CREATE_DOC_COMMAND,
  //   createDoc
  // );

  const panelCommand = vscode.commands.registerCommand(ACTIVATE_COMMAND, () => {
    activatePanel(context);
  });

  // context.subscriptions.push(makeDocCommand);
  context.subscriptions.push(panelCommand);
}

export function deactivate() {
  console.log("deactivated");
}
