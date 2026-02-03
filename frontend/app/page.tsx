import Navbar from '@/components/Navbar';
import { ArrowRight, BarChart, Database, Lock, Info } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-[12px] font-medium uppercase tracking-widest mb-8">
            <Info size={14} /> Certified Banking Solution v2.0
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 text-white">
            Operational Intelligence for <br />
            Term Deposit Conversion.
          </h1>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Sistem manajemen prospek berbasis data yang dirancang untuk mengoptimalkan kampanye pemasaran perbankan melalui validasi metodologi Machine Learning yang ketat.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-md text-sm font-semibold transition-all">
              Sistem Login <ArrowRight size={18} />
            </Link>
            <Link href="/docs" className="w-full sm:w-auto border border-slate-700 hover:bg-slate-900 px-8 py-3 rounded-md text-sm font-semibold transition-all">
              Panduan Pengguna
            </Link>
          </div>
        </div>
      </section>

      {/* --- CORE CAPABILITIES --- */}
      <section className="py-20 px-6 border-t border-slate-900 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="p-8 border border-slate-800 rounded-lg bg-slate-950">
              <BarChart className="text-emerald-500 mb-6" size={32} />
              <h3 className="text-lg font-bold mb-3">Predictive Validation</h3>
              <p className="text-slate-400 leading-relaxed text-sm font-light">
                Model klasifikasi XGBoost yang telah dimitigasi dari risiko data leakage, memastikan prediksi akurat sebelum kontak dilakukan.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 border border-slate-800 rounded-lg bg-slate-950">
              <Database className="text-emerald-500 mb-6" size={32} />
              <h3 className="text-lg font-bold mb-3">System Architecture</h3>
              <p className="text-slate-400 leading-relaxed text-sm font-light">
                Arsitektur terpisah (Decoupled) menggunakan FastAPI dan Next.js untuk performa tinggi, keamanan data, dan skalabilitas sistem.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 border border-slate-800 rounded-lg bg-slate-950">
              <Lock className="text-emerald-500 mb-6" size={32} />
              <h3 className="text-lg font-bold mb-3">Enterprise Security</h3>
              <p className="text-slate-400 leading-relaxed text-sm font-light">
                Otentikasi berbasis JSON Web Token (JWT) dengan enkripsi tingkat lanjut untuk melindungi kerahasiaan data nasabah perbankan.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- TECHNICAL SPECS --- */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto border border-slate-800 p-6 rounded-lg bg-slate-900/20">
          <p className="text-[11px] text-slate-500 uppercase tracking-widest mb-4">Integrasi Teknologi</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <span className="font-bold text-lg">FASTAPI</span>
             <span className="font-bold text-lg">NEXT.JS</span>
             <span className="font-bold text-lg">XGBOOST</span>
             <span className="font-bold text-lg">SHAP</span>
             <span className="font-bold text-lg">POSTGRESQL</span>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="mt-auto py-10 px-6 border-t border-slate-900 text-center">
        <p className="text-slate-600 text-[12px] tracking-wide">
          SMARTCONVERT CRM &copy; 2026. <br />
          TECHNICAL INFRASTRUCTURE BY RYAN BESTO SARAGIH.
        </p>
      </footer>
    </main>
  );
}