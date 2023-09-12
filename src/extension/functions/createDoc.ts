import * as vscode from "vscode";
import * as path from "path";

export const createDoc = (fileName: string, panel: vscode.WebviewPanel) => {
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
  const vscodeCss = vscode.Uri.file(
    path.join(__dirname, "..", "..", "media", "vscode.css")
  );

  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel='stylesheet' href='${vscodeCss}' />
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
