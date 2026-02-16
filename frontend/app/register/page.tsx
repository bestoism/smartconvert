"use client";

import { useState } from 'react';
import { ShieldCheck, User, Lock, ArrowLeft, Eye, EyeOff, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useToast } from '@/components/Toast';

export default function RegisterPage() {
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/register', formData);
      
      showToast("Registrasi Berhasil! Akun Anda telah terdaftar di database.", "success");
      
      router.push('/login');
    } catch (err: any) {
      showToast(err.response?.data?.detail || "Gagal membuat akun. Username mungkin sudah digunakan.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-slate-950 text-slate-100">
      
      {/* --- SISI KIRI: DESKTOP ONLY --- */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-emerald-950/10 border-r border-slate-900">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 transition-colors w-fit group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="text-sm font-medium">Kembali ke Beranda</span>
        </Link>
        <div>
          <ShieldCheck className="text-emerald-500 mb-6" size={48} />
          <h1 className="text-4xl font-bold mb-4 tracking-tight text-white leading-tight">Bergabung dengan <br/> Infrastruktur SmartConvert.</h1>
          <p className="text-slate-400 font-light max-w-sm leading-relaxed">Mulai optimasi penjualan deposito Anda dengan kekuatan Predictive Intelligence dan validasi data yang ketat.</p>
        </div>
        <p className="text-[10px] text-slate-700 uppercase tracking-widest font-bold text-center lg:text-left">v2.0 Stable Build</p>
      </div>

      {/* --- SISI KANAN: FORM REGISTER (RESPONSIVE) --- */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-24 relative">
        
        {/* TOMBOL BACK UNTUK MOBILE (Muncul hanya di layar kecil) */}
        <div className="lg:hidden absolute top-8 left-8">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 transition-colors">
            <ArrowLeft size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Beranda</span>
          </Link>
        </div>

        <div className="max-w-sm w-full mx-auto">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-2xl font-bold mb-2 text-white">Buat Akun Baru</h2>
            <p className="text-sm text-slate-500 mb-8 font-light tracking-tight">Daftarkan identitas sales Anda untuk akses sistem analitik.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">Username</label>
              <div className="relative group">
                <User className="absolute left-3 top-3 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  required
                  type="text"
                  placeholder="Username Anda"
                  className="w-full bg-slate-900 border border-slate-800 rounded-md py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-700 text-white"
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-md py-2.5 pl-10 pr-10 text-sm focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-700 text-white"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-3 text-slate-600 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-md transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin" size={16} /> 
                  Mendaftarkan...
                </>
              ) : (
                "Daftar Sekarang"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-500">
            Sudah punya akses? <Link href="/login" className="text-emerald-500 hover:underline font-bold transition-all">Masuk di sini</Link>
          </p>
        </div>
      </div>
    </main>
  );
}