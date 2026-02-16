"use client"; // Wajib agar bisa baca localStorage dan Router

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { Loader2, ShieldAlert } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 1. Cek Token di LocalStorage
    const token = localStorage.getItem('token');

    if (!token) {
      // 2. Jika tidak ada token (Incognito / sudah logout), tendang ke login
      console.warn("Unauthorized access detected. Redirecting...");
      router.replace('/login');
    } else {
      // 3. Jika ada token, izinkan masuk
      setIsAuthorized(true);
      setIsChecking(false);
    }
  }, [router]);

  // --- LAYAR PROTEKSI (Mencegah Konten Bocor Sebelum Redirect) ---
  if (isChecking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
          <Loader2 className="animate-spin text-emerald-500 relative" size={40} />
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">
          <ShieldAlert size={12} /> Verifying Secure Session
        </div>
      </div>
    );
  }

  // Hanya render konten asli jika Authorized
  if (!isAuthorized) return null;

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Sidebar tetap di kiri */}
      <Sidebar />
      
      {/* Konten dashboard di kanan */}
      <main className="flex-1 overflow-y-auto bg-slate-950 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}