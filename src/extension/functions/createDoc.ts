import * as vscode from "vscode";
import * as path from "path";

export const createDoc = (fileName: string) => {
  const panel = vscode.window.createWebviewPanel(
    "customPanel",
    "Custom Panel",
    vscode.ViewColumn.Two,
    {}
  );

  const filePath = path.join(
    vscode.workspace.rootPath ?? "",
    "aiscribe-docs",
    `${fileName}.md`
  );

  vscode.workspace.fs.writeFile(
    vscode.Uri.file(filePath),
    new Uint8Array(Buffer.from("# " + fileName))
  );

  vscode.workspace.openTextDocument(filePath).then((doc) => {
    panel.webview.html = getWebviewContent(doc.getText());
  });
};

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
