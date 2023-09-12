import * as vscode from "vscode";
import { SideBarProvider } from "./SideBarProvider";

import {
  ACTIVATE_COMMAND,
  CREATE_DOC_COMMAND,
  CODE_SNIPPET_COMMAND
  RUN_COMMANDS,
} from "./extension/commands";
import {
  createDoc,
  activateExtension,
  runCommandsActive,
  codeSnippet
} from "./extension/functions";

export function activate(context: vscode.ExtensionContext) {
  //Register Sidebar Panel
  const sideBarProvider = new SideBarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "aiscribe-sidebar",
      sideBarProvider
    )
  );

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

  let codeSnippetCommand = vscode.commands.registerCommand(
    CODE_SNIPPET_COMMAND, 
    codeSnippet
  );

  const activateCommand = vscode.commands.registerCommand(
    ACTIVATE_COMMAND,
    activateExtension
  );

  const runCommands = vscode.commands.registerCommand(RUN_COMMANDS, () => {
    runCommandsActive();
  });

  context.subscriptions.push(createDocCommand);
  context.subscriptions.push(activateCommand);
  context.subscriptions.push(codeSnippetCommand);
  context.subscriptions.push(runCommands);
}

export function deactivate() {
  console.log("deactivated");
}
