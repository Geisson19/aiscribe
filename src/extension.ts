import * as vscode from "vscode";
import { SideBarProvider } from "./SideBarProvider";

import { ACTIVATE_COMMAND, CREATE_DOC_COMMAND } from "./extension/commands";
import { createDoc } from "./extension/functions";
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

  // const panel = vscode.window.createWebviewPanel(
  //   "chatPanel",
  //   "Chat Panel",
  //   vscode.ViewColumn.One,
  //   {}
  // );

  // panel.iconPath = {
  //   light: vscode.Uri.file(context.asAbsolutePath("media/icon.svg")),
  //   dark: vscode.Uri.file(context.asAbsolutePath("media/icon.svg")),
  // };

  const panelCommand = vscode.commands.registerCommand(ACTIVATE_COMMAND, () => {
    activatePanel(context);
  });

  const createDocCommand = vscode.commands.registerCommand(
    CREATE_DOC_COMMAND,
    () => {
      vscode.window
        .showInputBox({ prompt: "Enter the file name" })
        .then((fileName) => {
          createDoc(fileName ?? "newDoc");
        });
    }
  );

  context.subscriptions.push(panelCommand);
  context.subscriptions.push(createDocCommand);
}

export function deactivate() {
  console.log("deactivated");
}
