import React, { useState } from 'react';
import {
  Github,
  Download,
  Copy,
  Check,
  ExternalLink,
  Key,
  Terminal,
  ShieldCheck,
  X,
  FileCode,
  AlertTriangle
} from 'lucide-react';

interface GitHubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubExportModal: React.FC<GitHubExportModalProps> = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const repoUrl = 'https://github.com/lowlifedigital2x/cut-the-check';

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleDownloadZip = () => {
    // Triggers direct in-browser download of the generated zip bundle
    const link = document.createElement('a');
    link.href = '/ctc-cut-the-check.zip';
    link.download = 'ctc-cut-the-check.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0D1117] border border-amber-500/30 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.15)] overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-[#161B22]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <Github className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                Publish Cut The Check to GitHub
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                Target Repo: <span className="text-amber-300">lowlifedigital2x/cut-the-check</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Direct Browser Download (No 404) */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent border border-amber-500/40">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                  Method 1 · Direct In-Browser Download
                </span>
                <h3 className="text-sm font-bold text-white mt-1.5">
                  Download Project ZIP Directly to Your Computer
                </h3>
                <p className="text-xs text-zinc-300 mt-1">
                  Downloads all source code, components, icons, and configuration files in a clean 3.6 MB archive directly through your browser.
                </p>
              </div>
              <button
                onClick={handleDownloadZip}
                className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl deal-btn-gold font-black text-xs shadow-lg cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>CTC Download .ZIP</span>
              </button>
            </div>
          </div>

          {/* GitHub Actions CI / CD with Cache v6.1.0 */}
          <div className="p-4 rounded-xl bg-[#161B22] border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>GitHub Actions CI & Cache Configured</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    actions/cache@v6.1.0
                  </span>
                </h3>
              </div>
              <button
                onClick={() => handleCopy(
`name: CI / Build & Test

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    name: Build & Validate
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Cache
        uses: actions/cache@v6.1.0
        with:
          path: |
            ~/.npm
            node_modules
          key: \${{ runner.os }}-node-\${{ hashFiles('**/package.json', '**/bun.lock') }}
          restore-keys: |
            \${{ runner.os }}-node-

      - name: Install Dependencies
        run: npm install

      - name: Run Type Check & Lint
        run: npm run lint

      - name: Build Application
        run: npm run build`,
                  'ci_yaml'
                )}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 cursor-pointer transition"
              >
                {copiedSection === 'ci_yaml' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied Workflow!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>CTC Copy CI YAML</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Workflow file <code className="text-amber-300 bg-black/40 px-1 py-0.5 rounded font-mono">.github/workflows/ci.yml</code> caches dependencies with <strong className="text-emerald-400">actions/cache@v6.1.0</strong> to speed up builds and tests on every commit:
            </p>
            <pre className="p-3 rounded-lg bg-black/60 border border-zinc-800/80 text-[11px] font-mono text-zinc-300 overflow-x-auto leading-relaxed">
{`- name: Cache
  uses: actions/cache@v6.1.0
  with:
    path: |
      ~/.npm
      node_modules
    key: \${{ runner.os }}-node-\${{ hashFiles('**/package.json', '**/bun.lock') }}
    restore-keys: |
      \${{ runner.os }}-node-`}
            </pre>
          </div>

          {/* Terminal / Git Command Option */}
          <div className="p-4 rounded-xl bg-[#161B22] border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white">
                  Method 3 · Terminal Commands on Your Computer
                </h3>
              </div>
              <button
                onClick={() => handleCopy(
`git clone https://github.com/lowlifedigital2x/ctc-cut-the-check.git
cd ctc-cut-the-check
# Copy downloaded unzipped files here
git add .
git commit -m "feat: Cut The Check full platform"
git push origin main`,
                  'term'
                )}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 cursor-pointer transition"
              >
                {copiedSection === 'term' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>CTC Copy Commands</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-black/60 border border-zinc-800/80 text-[11px] font-mono text-zinc-300 overflow-x-auto leading-relaxed">
{`git clone https://github.com/lowlifedigital2x/ctc-cut-the-check.git
cd ctc-cut-the-check
# (extract the downloaded ZIP into this folder)
git add .
git commit -m "feat: complete Cut The Check platform"
git push origin main`}
            </pre>
          </div>

          {/* Direct Web Upload Instruction Note */}
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-start gap-3">
            <FileCode className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-300">
              <span className="font-bold text-white block mb-0.5">Note for GitHub Web Uploader:</span>
              On <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">your repo page</a>, click <strong className="text-zinc-100">"Add file"</strong> (top right) → <strong className="text-zinc-100">"Upload files"</strong>. Extract the ZIP first before dragging files so GitHub accepts the directory structure.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-zinc-800 bg-[#161B22]">
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-400 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open github.com/lowlifedigital2x/ctc-cut-the-check</span>
          </a>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
