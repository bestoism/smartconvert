import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-emerald-500" size={24} />
          <span className="text-xl font-semibold tracking-tight text-slate-100">SmartConvert</span>
        </div>
        
        <div className="flex items-center gap-6">
          <Link href="/docs" className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors">
            Documentation
          </Link>
          <Link href="/login" className="text-sm font-semibold bg-slate-100 text-slate-950 px-5 py-2 rounded-md hover:bg-slate-200 transition-all">
            System Access
          </Link>
        </div>
      </div>
    </nav>
  );
}