import * as vscode from "vscode";
import * as path from "path";

export const createDoc = (fileName: string) => {
  const filePath = path.join(
    vscode.workspace.rootPath ?? "",
    "aiscribe-docs",
    `${fileName}.md`
  );

  vscode.workspace.fs.writeFile(
    vscode.Uri.file(filePath),
    new Uint8Array(Buffer.from("# " + fileName))
  );
};
