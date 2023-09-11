import * as vscode from "vscode";
import { SideBarProvider } from "./SideBarProvider";

import { ACTIVATE_COMMAND } from "./extension/commands";
import { activatePanel } from "./extension/panel";

export function activate(context: vscode.ExtensionContext) {
  //Register Sidebar Panel
  const sideBarProvider = new SideBarProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "aiscribe-sidebar",
      sideBarProvider
    )
  );

  const panelCommand = vscode.commands.registerCommand(ACTIVATE_COMMAND, () => {
    activatePanel(context);
  });

  context.subscriptions.push(panelCommand);
}

export function deactivate() {
  console.log("deactivated");
}
