import * as vscode from "vscode";
import * as path from "path";

export const activateExtension = () => {
  const filePath = path.join(
    vscode.workspace.rootPath ?? "",
    "aiscribe-docs",
    "General.md"
  );

  vscode.workspace.fs.writeFile(
    vscode.Uri.file(filePath),
    new Uint8Array(Buffer.from("# General"))
  );
};
