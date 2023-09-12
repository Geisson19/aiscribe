import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import axios from "axios";

export function activatePanel(context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    "chatPanel",
    "Chat Panel",
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(context.extensionPath, "media")),
      ],
    }
  );

  panel.webview.html = getWebviewContent(context);

  panel.webview.onDidReceiveMessage((message) => {
    switch (message.command) {
      case "createDoc": {
        const fileName = message.text;
        const filePath = path.join(
          vscode.workspace.workspaceFolders?.[0].uri.path || "",
          "docs",
          `${fileName}.md`
        );

        fs.writeFileSync(filePath, "");

        vscode.workspace
          .openTextDocument(filePath)
          .then(
            (doc) => vscode.window.showTextDocument(doc, { preview: false })
          )
          .then((editor) => {
            editor.edit((editBuilder) => {
              editBuilder.insert(new vscode.Position(0, 0), "# Titulo");
            });
          });
        break;
      }
      case "greet":
        panel.webview.postMessage({ text: "Hello, world!" });
        break;
      case "selectFile":
        vscode.window
          .showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
          })
          .then((uris) => {
            if (uris && uris.length > 0) {
              const filePath = uris[0].fsPath;
              const fileContent = fs.readFileSync(filePath, "utf-8");
              panel.webview.postMessage({ text: fileContent });
              sendFileInfoToApi(fileContent);
            }
          });
        break;
    }
  });
}

function getWebviewContent(context: vscode.ExtensionContext) {
  const mediaPath = path.join(context.extensionPath, "media");
  const scriptPath = vscode.Uri.file(path.join(mediaPath, "script.js")).with({
    scheme: "vscode-resource",
  });
  const stylePath = vscode.Uri.file(path.join(mediaPath, "style.css")).with({
    scheme: "vscode-resource",
  });

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="${stylePath}">
        <title>Chat Panel</title>
      </head>
      <body>
        <div id="chat"></div>
        <script src="${scriptPath}"></script>
      </body>
    </html>
  `;
}

function sendFileInfoToApi(fileContent: string) {
  axios.post("https://example.com/api", { fileContent }).then((response) => {
    console.log(response.data);
  });
}
