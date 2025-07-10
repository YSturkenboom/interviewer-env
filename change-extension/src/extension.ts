import * as vscode from 'vscode';
import fetch from 'node-fetch';
import * as jsdiff from 'diff';
import micromatch from 'micromatch';

type Snapshot = {
  uri: string;
  lastUploadedText: string;
  currentText: string;
};

const snapshots: Map<string, Snapshot> = new Map();

const ignorePatterns = [
  '/node_modules/',
  '/.git/',
  '/dist/',
  '/build/',
  '/.next/',
  '/coverage/',
  '/*.log',
  '/.env*',
];

function isIgnored(uri: string): boolean {
  const filePath = vscode.Uri.parse(uri).fsPath;
  return micromatch.isMatch(filePath, ignorePatterns);
}

export function activate(context: vscode.ExtensionContext) {
  vscode.workspace.onDidChangeTextDocument(event => {
    const uri = event.document.uri.toString();
    if (isIgnored(uri)) return;
    const text = event.document.getText();
    if (snapshots.has(uri)) {
      snapshots.get(uri)!.currentText = text;
    } else {
      snapshots.set(uri, {
        uri,
        lastUploadedText: text,
        currentText: text,
      });
    }
  });

  setInterval(async () => {
    const batch: {
      uri: string;
      filename: string;
      diff: string;
    }[] = [];

    for (const [uri, snap] of snapshots.entries()) {
      if (snap.lastUploadedText === snap.currentText || isIgnored(uri)) continue;

      const filename = vscode.Uri.parse(uri).fsPath.split('/').pop() || 'file';

      const diff = jsdiff.createPatch(
        filename,
        snap.lastUploadedText,
        snap.currentText,
        'previous',
        'current'
      );

      batch.push({
        uri,
        filename,
        diff,
      });

      // Mark as uploaded
      snap.lastUploadedText = snap.currentText;
    }

    if (batch.length > 0) {
      try {
        //TODO :: Batch upload to S3
        // await fetch('https://flexible-sound-mustang.ngrok-free.app/api/code-diff/batch', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     timestamp: Date.now(),
        //     diffs: batch,
        //   }),
        // });
        console.log(`[${new Date().toISOString()}] Sent ${batch.length} diffs`);
        console.log(`[${new Date().toISOString()}] Batch: ${JSON.stringify(batch)}`);
      } catch (err) {
        console.error('Failed to upload batch diffs:', err);
      }
    }
  }, 10000);
}

export function deactivate() { }