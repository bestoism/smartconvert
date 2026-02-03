"use client";

import { useState } from 'react';
import { ShieldCheck, User, Lock, ArrowLeft, Eye, EyeOff, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    try {
      const response = await api.post('/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', username);

      router.push('/dashboard');
      // Memastikan state terupdate setelah pindah halaman
      setTimeout(() => window.location.reload(), 100);
    } catch (err: any) {
      alert("Login Gagal: Username atau password salah.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sisi Kiri - Sama dengan Register untuk Konsistensi */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-emerald-950/10 border-r border-slate-900">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 transition-colors w-fit">
          <ArrowLeft size={18} /> <span className="text-sm">Beranda</span>
        </Link>
        <div>
          <ShieldCheck className="text-emerald-500 mb-6" size={48} />
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Otentikasi <br/> Infrastruktur Perbankan.</h1>
          <p className="text-slate-400 font-light max-w-sm">Silakan masukkan kredensial Anda untuk mengakses dashboard analitik.</p>
        </div>
        <p className="text-[10px] text-slate-700 uppercase tracking-widest">Secure Access Point</p>
      </div>

      <div className="flex-1 flex flex-col justify-center px-8 lg:px-24">
        <div className="max-w-sm w-full mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
               Selamat Datang <LogIn size={20} className="text-emerald-500"/>
            </h2>
            <p className="text-sm text-slate-500 font-light">Masukkan akun resmi untuk melanjutkan.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-600" size={18} />
                <input 
                  required
                  type="text"
                  placeholder="Username"
                  className="w-full bg-slate-900 border border-slate-800 rounded-md py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-600" size={18} />
                <input 
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-md py-2.5 pl-10 pr-10 text-sm focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-600 hover:text-slate-300">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-md transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? "Memverifikasi..." : "Masuk ke Sistem"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-500">
            Belum memiliki akun? <Link href="/register" className="text-emerald-500 hover:underline font-bold">Daftar di sini</Link>
          </p>
        </div>
      </div>
    </main>
  );
}