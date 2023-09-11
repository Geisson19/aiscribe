import * as vscode from "vscode";
import * as path from "path";
import axios from "axios";

export const activatePanel = (context: vscode.ExtensionContext) => {
  const panel = vscode.window.createWebviewPanel(
    "chatPanel",
    "Doc Panel",
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(context.extensionPath, "media")),
      ],
    }
  );

  panel.webview.html = getWebviewContent(context);

  panel.iconPath = {
    light: vscode.Uri.file(context.asAbsolutePath("media/icon.svg")),
    dark: vscode.Uri.file(context.asAbsolutePath("media/icon.svg")),
  };

  panel.webview.onDidReceiveMessage((message) => {
    switch (message.command) {
      case "sendMessage":
        axios.post("https://example.com", { message: message.text });
        break;
      case "getExtension":
        const extension = vscode.extensions.getExtension(message.extensionId);
        if (extension) {
          const api = extension.exports;
          // Call the API of the other extension
        }
        break;
    }
  });
};

const getWebviewContent = (context: vscode.ExtensionContext) => {
  const mediaPath = path.join(context.extensionPath, "media");

  const stylePath = vscode.Uri.file(path.join(mediaPath, "style.css")).with({
    scheme: "vscode-resource",
  });

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src vscode-resource:; style-src vscode-resource: 'unsafe-inline';" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Doc View</title>
      <link rel="stylesheet" href="${stylePath}"/>
    </head>
    <body>
      <div id="doc">algo</div>
    </body>
  </html>
  `;
};
