import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Cloud, 
  ExternalLink, 
  Copy, 
  Check, 
  Server, 
  FileCode2, 
  ArrowRight, 
  ShieldCheck, 
  Globe, 
  Zap, 
  Terminal,
  HelpCircle
} from 'lucide-react';

export const RenderDeployModal: React.FC = () => {
  const { isRenderDeployModalOpen, setIsRenderDeployModalOpen } = useApp();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [deployType, setDeployType] = useState<'static' | 'blueprint'>('static');

  if (!isRenderDeployModalOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const renderYamlContent = `# render.yaml - Render Blueprint Specification
services:
  - type: web
    name: business-connect-india
    runtime: static
    plan: free
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
    headers:
      - path: /*
        name: X-Frame-Options
        value: SAMEORIGIN
      - path: /assets/*
        name: Cache-Control
        value: public, max-age=31536000, immutable`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#18221C] rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-gray-200 dark:border-gray-800 my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white flex items-center justify-center shadow-md">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#18231D] dark:text-[#F0F4F1]">
                  Deploy Live on Render (render.com)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Ready
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Render par live deploy karne ke aasan steps aur settings
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsRenderDeployModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab switch */}
        <div className="mt-4 flex gap-2 p-1 bg-gray-100 dark:bg-gray-800/60 rounded-xl">
          <button
            onClick={() => setDeployType('static')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              deployType === 'static'
                ? 'bg-white dark:bg-[#18221C] text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> Option 1: Static Site (Fastest & Free)
          </button>
          <button
            onClick={() => setDeployType('blueprint')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              deployType === 'blueprint'
                ? 'bg-white dark:bg-[#18221C] text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" /> Option 2: Render Blueprint (render.yaml)
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {deployType === 'static' ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Static Site Recommended:</strong> Since this is a Vite + React SPA, Render offers 100% free hosting with global CDN caching, custom domains, and automatic HTTPS SSL.
                </div>
              </div>

              {/* Steps list */}
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2 font-bold text-xs text-gray-800 dark:text-gray-200 mb-1">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px]">1</span>
                    Push Code to GitHub
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 ml-7">
                    Apna project GitHub repository me push karein.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2 font-bold text-xs text-gray-800 dark:text-gray-200 mb-1">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px]">2</span>
                    Render Dashboard &gt; New Static Site
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 ml-7 mb-2">
                    Render.com par login karein aur <strong>New &gt; Static Site</strong> click karein, aur apna repo connect karein.
                  </p>
                  
                  {/* Configuration parameters */}
                  <div className="ml-7 space-y-2 mt-2">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-xs">
                      <div>
                        <span className="text-[11px] text-gray-400 block font-medium">Build Command:</span>
                        <code className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">npm run build</code>
                      </div>
                      <button
                        onClick={() => copyToClipboard('npm run build', 'build_cmd')}
                        className="px-2.5 py-1 text-[11px] rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'build_cmd' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        {copiedKey === 'build_cmd' ? 'Copied' : 'Copy'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-xs">
                      <div>
                        <span className="text-[11px] text-gray-400 block font-medium">Publish Directory:</span>
                        <code className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">dist</code>
                      </div>
                      <button
                        onClick={() => copyToClipboard('dist', 'publish_dir')}
                        className="px-2.5 py-1 text-[11px] rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'publish_dir' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        {copiedKey === 'publish_dir' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2 font-bold text-xs text-gray-800 dark:text-gray-200 mb-1">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px]">3</span>
                    Add Rewrite Rule for React Router (Important!)
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 ml-7 mb-2">
                    In Render dashboard Settings &gt; <strong>Redirects/Rewrites</strong>, add this single page rule:
                  </p>
                  <div className="ml-7 p-2 rounded-lg bg-white dark:bg-black/30 border border-gray-200 dark:border-gray-700 font-mono text-[11px] flex items-center justify-between">
                    <div>
                      <span className="text-gray-500">Source:</span> <strong className="text-gray-800 dark:text-gray-200">/*</strong> &rarr; <span className="text-gray-500">Destination:</span> <strong className="text-indigo-600 dark:text-indigo-400">/index.html</strong> (Rewrite)
                    </div>
                    <button
                      onClick={() => copyToClipboard('/* -> /index.html (Rewrite)', 'rewrite_rule')}
                      className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] font-medium"
                    >
                      {copiedKey === 'rewrite_rule' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2 font-bold text-xs text-gray-800 dark:text-gray-200 mb-1">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px]">4</span>
                    Click &quot;Create Static Site&quot;
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 ml-7">
                    Render automatically builds and deploys your site to a free URL like <code className="text-emerald-600 font-semibold">https://business-connect-xxx.onrender.com</code> in less than 2 minutes!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 text-xs text-purple-900 dark:text-purple-200 flex items-start gap-2.5">
                <FileCode2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Blueprint File Already Created:</strong> We have added <code className="font-mono bg-purple-100 dark:bg-purple-900 px-1 rounded">render.yaml</code> directly in your repository root! You can select <strong>New &gt; Blueprint</strong> in Render for zero-configuration auto-deploy!
                </div>
              </div>

              <div className="relative">
                <pre className="p-3 bg-gray-900 text-gray-200 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
                  {renderYamlContent}
                </pre>
                <button
                  onClick={() => copyToClipboard(renderYamlContent, 'render_yaml')}
                  className="absolute top-2 right-2 px-2.5 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center gap-1 font-medium transition cursor-pointer"
                >
                  {copiedKey === 'render_yaml' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'render_yaml' ? 'Copied YAML' : 'Copy render.yaml'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer CTAs */}
        <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Tested & compatible with Render Free Tier, Node 20+, and Vite 6+</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsRenderDeployModalOpen(false)}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer"
            >
              Close
            </button>
            <a
              href="https://dashboard.render.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>Open Render Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
