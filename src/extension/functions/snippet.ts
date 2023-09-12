import * as vscode from "vscode";

export const codeSnippet = async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No hay archivos de código abiertos.');
        return;
    }
    const mainFolder = vscode.workspace.workspaceFolders?.[0].name;

    const path = (editor.document.uri.path).split(mainFolder ?? "")[1];

    console.log(mainFolder);
    const ref = '[Fragmento de código](' + path + '#L' + editor.selection.start.line + ')';
    const codeSnippet = editor.document.getText(editor.selection);

    if (!codeSnippet) {
        vscode.window.showInformationMessage('No se ha seleccionado ningún snippet de código.');
        return;
    }
    
    const markdownEditors = vscode.window.visibleTextEditors.filter(e => e.document.languageId === 'markdown');

    if (markdownEditors.length === 0) {
        vscode.window.showErrorMessage('No hay archivos Markdown abiertos.');
        return;
    }

    const markdownEditor = markdownEditors[0];
    const markDownText = ref + '\n```\n' + codeSnippet + '\n```';
    const position = markdownEditor.selection.active;
    markdownEditor.edit((newText) => {
        newText.insert(position, markDownText);
    });
    
};