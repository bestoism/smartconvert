"use client";

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { 
  ArrowRight, 
  BarChart, 
  Database, 
  Lock, 
  Info, 
  Server, 
  RefreshCw 
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function LandingPage() {
  const [isServerAwake, setIsServerAwake] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [progress, setProgress] = useState(0);

  // --- LOGIKA MEMBANGUNKAN SERVER HUGGING FACE ---
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    const wakeUpServer = async () => {
      try {
        // Mengetuk root endpoint backend
        await api.get('/'); 
        setIsServerAwake(true);
        // Beri jeda sedikit setelah bangun agar transisinya smooth
        setTimeout(() => setIsChecking(false), 1000);
        setProgress(100);
      } catch (error) {
        console.log("Server is sleeping... attempting to wake up...");
      }
    };

    wakeUpServer();

    // Simulasi progress bar (HF biasanya butuh 15-30 detik untuk boot)
    progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 99) return 99;
        // Bergerak cepat di awal, melambat di akhir
        const increment = prev < 70 ? 5 : 0.5;
        return prev + increment;
      });
    }, 1000);

    // Cek status server setiap 3 detik
    const pingInterval = setInterval(() => {
      if (!isServerAwake) wakeUpServer();
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(pingInterval);
    };
  }, [isServerAwake]);

  return (
    <main className="flex flex-col min-h-screen bg-slate-950 text-slate-100 relative">
      <Navbar />

      {/* --- OVERLAY PRELOADER (Hanya muncul jika server HF sedang tidur) --- */}
      {isChecking && (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
          <div className="relative mb-10">
            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
            <Server size={56} className="text-emerald-500 relative animate-pulse" />
            <RefreshCw size={22} className="absolute -bottom-1 -right-1 text-emerald-400 animate-spin" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">Initializing Infrastructure</h2>
          <p className="text-sm text-slate-400 max-w-sm mb-10 font-light leading-relaxed">
            Menghubungkan ke AI Engine dan Database Cloud. Proses ini membutuhkan waktu sekitar 30 detik jika server dalam status hibernasi.
          </p>

          <div className="w-full max-w-xs h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-emerald-500 transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] font-mono text-slate-600 mt-5 uppercase tracking-[0.4em]">
            Booting Status: {Math.round(progress)}% Optimized
          </p>
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-[12px] font-medium uppercase tracking-widest mb-8">
            <Info size={14} /> Certified Banking Solution v2.0
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 text-white leading-tight">
            Operational Intelligence for <br />
            Term Deposit Conversion.
          </h1>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Sistem manajemen prospek berbasis data yang dirancang untuk mengoptimalkan kampanye pemasaran perbankan melalui validasi metodologi Machine Learning yang ketat.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-md text-sm font-semibold transition-all shadow-lg shadow-emerald-900/20">
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
              <h3 className="text-lg font-bold mb-3 text-white">Predictive Validation</h3>
              <p className="text-slate-400 leading-relaxed text-sm font-light">
                Model klasifikasi XGBoost yang telah dimitigasi dari risiko data leakage, memastikan prediksi akurat sebelum kontak dilakukan.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 border border-slate-800 rounded-lg bg-slate-950">
              <Database className="text-emerald-500 mb-6" size={32} />
              <h3 className="text-lg font-bold mb-3 text-white">Cloud Architecture</h3>
              <p className="text-slate-400 leading-relaxed text-sm font-light">
                Arsitektur terpisah menggunakan FastAPI, Next.js, dan PostgreSQL (Supabase) untuk performa tinggi dan persistensi data yang aman.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 border border-slate-800 rounded-lg bg-slate-950">
              <Lock className="text-emerald-500 mb-6" size={32} />
              <h3 className="text-lg font-bold mb-3 text-white">Enterprise Security</h3>
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
          <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
             <span className="font-bold text-sm tracking-tighter">FASTAPI</span>
             <span className="font-bold text-sm tracking-tighter">NEXT.JS</span>
             <span className="font-bold text-sm tracking-tighter">XGBOOST</span>
             <span className="font-bold text-sm tracking-tighter">SHAP</span>
             <span className="font-bold text-sm tracking-tighter">POSTGRESQL</span>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="mt-auto py-10 px-6 border-t border-slate-900 text-center">
        <p className="text-slate-600 text-[10px] tracking-widest font-bold uppercase">
          SMARTCONVERT CRM &copy; 2026. <br />
          TECHNICAL INFRASTRUCTURE BY RYAN BESTO SARAGIH.
        </p>
      </footer>
    </main>
  );
}