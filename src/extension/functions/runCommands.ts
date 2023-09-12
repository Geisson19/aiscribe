import axios from "axios";
import * as vscode from "vscode";

export const runCommandsActive = async () => {
  // Get the current document
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor");
    return;
  }

  const document = editor.document;
  const text = document.getText();

  // Get all the lines that starts with /prompt
  const lines = text.split("\n");
  const promptLineMatches = lines
    .filter((line) => line.startsWith("/prompt"))
    .map((line) => line.replace("/prompt", "").trim());

  // For each /prompt command
  for (const promptLine of promptLineMatches) {
    // Get the api response
    const response = await axios.get(
      `https://aiscribeapi.azurewebsites.net/?prompt=${promptLine}`
    );

    const apiResponse = response.data;
    const apiResponseText = apiResponse.response.content;

    // Put the api response in the document just below the /prompt command
    const promptLineIndex = lines.indexOf(promptLine);
    lines.splice(promptLineIndex + 1, 0, apiResponseText);
  }

  // Update the document with the new text
  const newText = lines.join("\n");
  const firstLine = document.lineAt(0);
  const lastLine = document.lineAt(document.lineCount - 1);
  const textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
  const edit = new vscode.WorkspaceEdit();
  edit.replace(document.uri, textRange, newText);
  await vscode.workspace.applyEdit(edit);

  // Save the document
  await document.save();

  await runTranslateActive();
};

// copy and paste the code above here but change the /prompt command to /translate

const runTranslateActive = async () => {
  // Get the current document
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor");
    return;
  }

  const document = editor.document;
  const text = document.getText();
  console.log(text);

  // Get all the lines that starts with /translate
  const lines = text.split("\n");
  const translateLineMatches = lines
    .filter((line) => line.startsWith("/translate"))
    .map((line) => line.replace("/translate", "").trim());

  // For each /translate command
  for (const translateLine of translateLineMatches) {
    console.log(translateLine);

    // Get the api response
    const response = await axios.get(
      `https://aiscribeapi.azurewebsites.net/?text=${translateLine}`
    );

    const apiResponse = response.data;
    const apiResponseText = apiResponse.response.content;

    // Put the api response in the document just below the /translate command
    const translateLineIndex = lines.indexOf(translateLine);
    lines.splice(translateLineIndex + 1, 0, apiResponseText);
  }

  // Update the document with the new text
  const newText = lines.join("\n");
  console.log(newText);
  const firstLine = document.lineAt(0);
  const lastLine = document.lineAt(document.lineCount - 1);
  const textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
  const edit = new vscode.WorkspaceEdit();
  edit.replace(document.uri, textRange, newText);
  await vscode.workspace.applyEdit(edit);

  // Save the document
  await document.save();
};
