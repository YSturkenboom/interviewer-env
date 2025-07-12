import * as vscode from 'vscode';
import * as jsdiff from 'diff';
import micromatch from 'micromatch';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as path from 'path';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

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

const bucket = process.env.AWS_BUCKET || 'fallback-bucket';
async function uploadSnapshot(
  interviewTakenId: string,
  filename: string,
  content: string
) {
  const key = `coding-snapshots/${interviewTakenId}/snapshots/${Date.now()}_${path.basename(filename)}`;

  try {
    const res = await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: content,
        ContentType: 'text/plain',
      })
    );

    console.log(`✅ Uploaded snapshot to S3: ${key}`);
  } catch (err) {
    console.error('❌ Failed to upload snapshot:', err);
  }
}

export function activate(context: vscode.ExtensionContext) {
  const interviewTakenId = process.env.INTERVIEW_TAKEN_ID!;
  if (!interviewTakenId) {
    vscode.window.showErrorMessage(
      '⚠️ INTERVIEW_TAKEN_ID environment variableN is missing. Snapshots will not be saved.\nplease contact us.'
    );
  }
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
        for (const file of batch) {
          await uploadSnapshot(interviewTakenId, file.filename, file.diff);
        }
        console.log(`[${new Date().toISOString()}] Sent ${batch.length} diffs : INtervieew==>${interviewTakenId}`);
        console.log(`[${new Date().toISOString()}] Batch: ${JSON.stringify(batch)}`);
      } catch (err) {
        console.error('Failed to upload batch diffs:', err);
      }
    }
  }, 10000);
}

export function deactivate() { }