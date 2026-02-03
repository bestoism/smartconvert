import Navbar from '@/components/Navbar';
import { 
  Terminal, 
  Cpu, 
  Layers, 
  Database, 
  ShieldCheck, 
  ArrowLeft,
  Code2,
  GitBranch,
  Server
} from 'lucide-react';
import Link from 'next/link';

export default function TechnicalDocumentation() {
  return (
    <main className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-24 pb-20 w-full">
        
        {/* --- BACK BUTTON --- */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-500 transition-colors mb-10 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Kembali ke Beranda
        </Link>

        {/* --- HEADER --- */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-blue-500/20 bg-blue-500/5 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            <Terminal size={12} /> System Administrator Only
          </div>
          <h1 className="text-4xl font-bold mb-4 text-white tracking-tight">Dokumentasi Teknis</h1>
          <p className="text-lg text-slate-400 font-light max-w-2xl">
            Spesifikasi infrastruktur, arsitektur sistem, dan detail algoritma Machine Learning SmartConvert CRM.
          </p>
        </div>

        <div className="space-y-24">
          
          {/* Section: Tech Stack */}
          <section id="stack" className="scroll-mt-24">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-white uppercase tracking-wider">
              <Layers className="text-emerald-500" size={20} /> Technology Stack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg bg-slate-900/50 border border-slate-800">
                <h3 className="text-emerald-500 font-bold text-sm mb-4">Frontend Environment</h3>
                <ul className="text-sm text-slate-400 space-y-2 font-mono">
                  <li>• Next.js 15 (App Router)</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS v4</li>
                  <li>• Lucide React (Icons)</li>
                </ul>
              </div>
              <div className="p-6 rounded-lg bg-slate-900/50 border border-slate-800">
                <h3 className="text-emerald-500 font-bold text-sm mb-4">Backend Infrastructure</h3>
                <ul className="text-sm text-slate-400 space-y-2 font-mono">
                  <li>• FastAPI (High Performance Python)</li>
                  <li>• SQLAlchemy (ORM)</li>
                  <li>• SQLite / PostgreSQL</li>
                  <li>• Uvicorn (ASGI Server)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section: API Endpoints */}
          <section id="api" className="scroll-mt-24">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-white uppercase tracking-wider">
              <Server className="text-emerald-500" size={20} /> API Architecture (REST)
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-md">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-500 text-[10px] font-bold rounded">POST</span>
                  <code className="text-sm text-slate-200">/api/v1/login</code>
                </div>
                <p className="text-xs text-slate-500">OAuth2 compatible password grant flow. Returns JWT Token.</p>
              </div>
              
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-md">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-500 text-[10px] font-bold rounded">GET</span>
                  <code className="text-sm text-slate-200">/api/v1/leads</code>
                </div>
                <p className="text-xs text-slate-500">Fetch batch leads with server-side pagination and sorting.</p>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-md">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-500 text-[10px] font-bold rounded">POST</span>
                  <code className="text-sm text-slate-200">/api/v1/upload-csv</code>
                </div>
                <p className="text-xs text-slate-500">Multipart/form-data upload. Triggers automated cleaning & ML inference.</p>
              </div>
            </div>
          </section>

          {/* Section: ML Model */}
          <section id="model" className="scroll-mt-24">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-white uppercase tracking-wider">
              <Cpu className="text-emerald-500" size={20} /> Machine Learning Engine
            </h2>
            <div className="p-8 rounded-lg bg-slate-900/30 border border-slate-800">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h4 className="text-white font-semibold text-sm">Model Specifications</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs text-slate-500">Algorithm</span>
                      <span className="text-xs font-mono text-emerald-400">XGBoost v2.0</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs text-slate-500">Primary Metric</span>
                      <span className="text-xs font-mono text-emerald-400">F1-Score (0.50)</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs text-slate-500">Interpretability</span>
                      <span className="text-xs font-mono text-emerald-400">SHAP Kernels</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-white font-semibold text-sm">Data Integrity Features</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Sistem ini telah memitigasi isu <strong className="text-slate-300">Data Leakage</strong> dengan menghapus fitur 
                    durasi panggilan, memastikan model hanya memproses data yang tersedia sebelum kontak dimulai.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Directory Structure */}
          <section id="structure" className="scroll-mt-24 pb-20">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-white uppercase tracking-wider">
              <Code2 className="text-emerald-500" size={20} /> Project Architecture
            </h2>
            <pre className="p-6 rounded-lg bg-black/40 border border-slate-800 text-[13px] text-slate-400 font-mono leading-relaxed">
{`SmartConvert-Next/
├── backend/
│   ├── app/
│   │   ├── ml_assets/       # Model (.pkl) & Config (.json)
│   │   ├── auth.py          # JWT & Security Logic
│   │   ├── crud.py          # Database Operations
│   │   ├── main.py          # API Gateway
│   │   └── ml_service.py    # XGBoost & SHAP Inference
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js App Router (Pages)
│   │   ├── components/     # Reusable UI Blocks
│   │   └── lib/            # API & Global Config
└── Dockerfile              # Production Deployment Config`}
            </pre>
          </section>

        </div>

        {/* Footer */}
        <div className="pt-10 border-t border-slate-900 text-center">
          <p className="text-[10px] text-slate-600 uppercase tracking-widest">
            Last Updated: February 2026 • Build 1.0.4-stable
          </p>
        </div>

      </div>
    </main>
  );
}