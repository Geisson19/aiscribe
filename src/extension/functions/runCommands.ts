import axios from "axios";
import * as vscode from "vscode";

export const runCommandsActive = async () => {
  // Get the current document
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor");
    return;
  }

  // Get the current document's text
  const document = editor.document;
  const text = document.getText();
  console.log(text);

  // Scan for all /prompt commands
  const regex = /\/prompt\s{(.*)}/g;
  const matches = text.matchAll(regex);

  // For each /prompt command
  for (const match of matches) {
    console.log(match);
    // Get the input
    const input = match[1];

    // Get the api response
    const response = await axios.post(
      `https://aiscribeapi.azurewebsites.net/?prompt=${input}`
    );

    const apiResponse = response.data;
    const apiResponseText = apiResponse.text;
    const apiResponseTextWithPrompt = `/prompt {${input}}\n${apiResponseText}`;
    text.replace(match[0], apiResponseTextWithPrompt);
  }

  // Replace the current document's text with the new text
  const fullRange = new vscode.Range(
    document.positionAt(0),
    document.positionAt(text.length)
  );

  editor.edit((editBuilder) => {
    editBuilder.replace(fullRange, text);
  });

  // Save the document
  await document.save();
};
