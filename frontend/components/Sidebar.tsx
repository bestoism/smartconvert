"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  LogOut, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Leads Data', href: '/dashboard/leads', icon: Users },
  { name: 'My Profile', href: '/dashboard/profile', icon: UserCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <div className="w-64 bg-slate-950 border-r border-slate-900 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-900">
        <div className="flex items-center gap-2 text-emerald-500">
          <ShieldCheck size={24} />
          <span className="text-xl font-bold tracking-tighter text-white">SMARTCONVERT</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group ${
                isActive 
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
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
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/5 hover:text-red-300 rounded-lg transition-all"
        >
          <LogOut size={18} />
          Sign Out System
        </button>
      </div>
    </div>
  );
}