"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
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

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    const wakeUpServer = async () => {
      try {
        const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
        const rootUrl = rawUrl.replace('/api/v1', ''); 
        await axios.get(rootUrl); 
        
        setIsServerAwake(true);
        setTimeout(() => setIsChecking(false), 1000);
        setProgress(100);
      } catch (error) {
        console.log("Infrastructure is warming up...");
      }
    };

    wakeUpServer();
    
    progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 99) return 99;
        const increment = prev < 70 ? 5 : 0.5;
        return prev + increment;
      });
    }, 1000);

    const pingInterval = setInterval(() => {
      if (!isServerAwake) wakeUpServer();
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(pingInterval);
    };
  }, [isServerAwake]);

  return (
    <main className="flex flex-col min-h-screen bg-slate-950 text-slate-100 relative overflow-x-hidden">
      <Navbar />

      {/* --- OVERLAY PRELOADER (Sustain for Mobile) --- */}
      {isChecking && (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
          <div className="relative mb-10">
            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
            <Server className="text-emerald-500 relative animate-pulse w-12 h-12 md:w-14 md:h-14" />
            <RefreshCw size={20} className="absolute -bottom-1 -right-1 text-emerald-400 animate-spin" />
          </div>
          
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight">Initializing Infrastructure</h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-[280px] md:max-w-sm mb-10 font-light leading-relaxed">
            Menghubungkan ke AI Engine dan Database Cloud. Harap tunggu sekitar 30 detik.
          </p>

          <div className="w-full max-w-[250px] md:max-w-xs h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-emerald-500 transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[9px] md:text-[10px] font-mono text-slate-600 mt-5 uppercase tracking-[0.3em]">
            Booting: {Math.round(progress)}% Optimized
          </p>
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-[10px] md:text-[12px] font-medium uppercase tracking-widest mb-6 md:mb-8">
            <Info size={12} /> Certified Banking Solution v2.0
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-6 md:mb-8 text-white leading-tight">
            Operational Intelligence for <br className="hidden md:block" />
            Term Deposit Conversion.
          </h1>
          
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed font-light">
            Sistem manajemen prospek berbasis data yang dirancang untuk mengoptimalkan kampanye pemasaran perbankan melalui validasi Machine Learning.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
            <Link href="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-md text-sm font-semibold transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
              Sistem Login <ArrowRight size={18} />
            </Link>
            <Link href="/docs" className="w-full sm:w-auto border border-slate-700 hover:bg-slate-900 text-slate-200 px-8 py-3.5 rounded-md text-sm font-semibold transition-all active:scale-95">
              Panduan Pengguna
            </Link>
          </div>
        </div>
      </section>

      {/* --- CORE CAPABILITIES --- */}
      <section className="py-16 md:py-20 px-6 border-t border-slate-900 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            
            {/* Feature 1 */}
            <div className="p-6 md:p-8 border border-slate-800 rounded-lg bg-slate-950 hover:border-emerald-500/30 transition-colors">
              <BarChart className="text-emerald-500 mb-5 md:mb-6 w-7 h-7 md:w-8 md:h-8" />
              <h3 className="text-lg font-bold mb-3 text-white">Predictive Validation</h3>
              <p className="text-slate-400 leading-relaxed text-sm font-light">
                Model XGBoost yang tervalidasi bebas data leakage, memastikan prediksi akurat sebelum kontak dilakukan.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 md:p-8 border border-slate-800 rounded-lg bg-slate-950 hover:border-emerald-500/30 transition-colors">
              <Database className="text-emerald-500 mb-5 md:mb-6 w-7 h-7 md:w-8 md:h-8" />
              <h3 className="text-lg font-bold mb-3 text-white">Cloud Architecture</h3>
              <p className="text-slate-400 leading-relaxed text-sm font-light">
                Arsitektur terpisah menggunakan FastAPI, Next.js, dan PostgreSQL (Supabase) untuk persistensi data aman.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 md:p-8 border border-slate-800 rounded-lg bg-slate-950 hover:border-emerald-500/30 transition-colors">
              <Lock className="text-emerald-500 mb-5 md:mb-6 w-7 h-7 md:w-8 md:h-8" />
              <h3 className="text-lg font-bold mb-3 text-white">Enterprise Security</h3>
              <p className="text-slate-400 leading-relaxed text-sm font-light">
                Otentikasi berbasis JSON Web Token (JWT) dengan enkripsi tingkat lanjut untuk melindungi data nasabah.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- TECHNICAL SPECS --- */}
      <section className="py-12 md:py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto border border-slate-800 p-6 md:p-8 rounded-lg bg-slate-900/20">
          <p className="text-[10px] md:text-[11px] text-slate-500 uppercase tracking-widest mb-6">Integrasi Teknologi Utama</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 md:gap-8 opacity-40 grayscale">
              <span className="font-bold text-xs md:text-sm tracking-tighter text-slate-300">FASTAPI</span>
              <span className="font-bold text-xs md:text-sm tracking-tighter text-slate-300">NEXT.JS</span>
              <span className="font-bold text-xs md:text-sm tracking-tighter text-slate-300">XGBOOST</span>
              <span className="font-bold text-xs md:text-sm tracking-tighter text-slate-300">SHAP</span>
              <span className="font-bold text-xs md:text-sm tracking-tighter text-slate-300">POSTGRESQL</span>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="mt-auto py-8 md:py-10 px-6 border-t border-slate-900 text-center">
        <p className="text-slate-600 text-[9px] md:text-[10px] tracking-widest font-bold uppercase leading-loose">
          SMARTCONVERT CRM &copy; 2026. <br />
          TECHNICAL INFRASTRUCTURE BY RYAN BESTO SARAGIH.
        </p>
      </footer>
    </main>
  );
}