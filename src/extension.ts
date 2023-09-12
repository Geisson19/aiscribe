import * as vscode from "vscode";
import { SideBarProvider } from "./SideBarProvider";

import { ACTIVATE_COMMAND, CREATE_DOC_COMMAND } from "./extension/commands";
import { createDoc, activateExtension } from "./extension/functions";

export function activate(context: vscode.ExtensionContext) {
  //Register Sidebar Panel
  const sideBarProvider = new SideBarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "aiscribe-sidebar",
      sideBarProvider
    )
  );

  const panel = vscode.window.createWebviewPanel(
    "chatPanel",
    "Ai Scribe panel",
    vscode.ViewColumn.One,
    {}
  );

  const createDocCommand = vscode.commands.registerCommand(
    CREATE_DOC_COMMAND,
    () => {
      vscode.window
        .showInputBox({ prompt: "Enter the file name" })
        .then((fileName) => {
          createDoc(fileName ?? "newDoc", panel);
        });
    }
  );

  const activateCommand = vscode.commands.registerCommand(
    ACTIVATE_COMMAND,
    activateExtension
  );

  context.subscriptions.push(createDocCommand);
  context.subscriptions.push(activateCommand);
}

export function deactivate() {
  console.log("deactivated");
}

function getWebviewContent(content: string) {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AiScribe</title>
    </head>
    <body>
        <textarea id="editor">${content}</textarea>
        <script>
            const vscode = acquireVsCodeApi();
            const editor = document.getElementById("editor");
            editor.addEventListener("input", () => {
                vscode.postMessage({
                    command: "updateContent",
                    content: editor.value
                });
            });
        </script>
    </body>
    </html>`;
}
