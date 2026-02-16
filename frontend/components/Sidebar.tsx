"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  LogOut, 
  ShieldCheck,
  ChevronRight,
  BrainCircuit,
  Zap,
  Menu,
  X
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Leads Data', href: '/dashboard/leads', icon: Users },
  { name: 'AI Model Lab', href: '/dashboard/ai-lab', icon: BrainCircuit },
  { name: 'AI Simulator', href: '/dashboard/simulator', icon: Zap },
  { name: 'My Profile', href: '/dashboard/profile', icon: UserCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // State untuk Mobile Toggle

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Gunakan replace agar history browser tentang 'dashboard' terhapus
    router.replace('/login');
    // Force reload untuk memastikan semua state bersih
    setTimeout(() => window.location.reload(), 100);
  };

  // Komponen Isi Menu (Agar tidak duplikasi kode antara desktop & mobile)
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-slate-900">
        <div className="flex items-center gap-2 text-emerald-500">
          <ShieldCheck size={24} />
          <span className="text-xl font-bold tracking-tighter text-white">SMARTCONVERT</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)} // Tutup sidebar setelah klik di mobile
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group ${
                isActive 
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
              }`}
            >
              <item.icon size={18} />
              {item.name}
              {isActive && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-900">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-rose-400 hover:bg-rose-500/5 hover:text-rose-300 rounded-lg transition-all"
        >
          <LogOut size={18} />
          Sign Out System
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* --- MOBILE HEADER (Hanya muncul di layar kecil) --- */}
      <div className="lg:hidden fixed top-0 w-full z-[60] bg-slate-950 border-b border-slate-900 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-2 text-emerald-500">
          <ShieldCheck size={20} />
          <span className="text-lg font-bold tracking-tighter text-white uppercase">SmartConvert</span>
        </div>
        <button onClick={() => setIsOpen(true)} className="p-2 text-slate-400 hover:text-emerald-500 transition-colors">
          <Menu size={24} />
        </button>
      </div>

      {/* --- DESKTOP SIDEBAR (Sembunyi di layar kecil) --- */}
      <aside className="hidden lg:block w-64 bg-slate-950 border-r border-slate-900 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* --- MOBILE DRAWER OVERLAY --- */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] flex">
          {/* Backdrop gelap transparan */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Menu Drawer dari kiri */}
          <div className="relative w-72 bg-slate-950 h-full shadow-2xl border-r border-slate-800 animate-in slide-in-from-left duration-300">
            <div className="absolute top-4 right-4">
               <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:text-white">
                  <X size={24} />
               </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}