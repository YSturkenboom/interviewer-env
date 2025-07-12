"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const jsdiff = __importStar(require("diff"));
const micromatch_1 = __importDefault(require("micromatch"));
const snapshots = new Map();
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
function isIgnored(uri) {
    const filePath = vscode.Uri.parse(uri).fsPath;
    return micromatch_1.default.isMatch(filePath, ignorePatterns);
}
function activate(context) {
    vscode.workspace.onDidChangeTextDocument(event => {
        const uri = event.document.uri.toString();
        if (isIgnored(uri))
            return;
        const text = event.document.getText();
        if (snapshots.has(uri)) {
            snapshots.get(uri).currentText = text;
        }
        else {
            snapshots.set(uri, {
                uri,
                lastUploadedText: text,
                currentText: text,
            });
        }
    });
    setInterval(async () => {
        const batch = [];
        for (const [uri, snap] of snapshots.entries()) {
            if (snap.lastUploadedText === snap.currentText || isIgnored(uri))
                continue;
            const filename = vscode.Uri.parse(uri).fsPath.split('/').pop() || 'file';
            const diff = jsdiff.createPatch(filename, snap.lastUploadedText, snap.currentText, 'previous', 'current');
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
            }
            catch (err) {
                console.error('Failed to upload batch diffs:', err);
            }
        }
    }, 10000);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map