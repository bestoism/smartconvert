import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="text-emerald-500" size={32} />
          <span className="text-2xl font-bold tracking-tighter">SMARTCONVERT</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <Link href="/docs" className="hover:text-emerald-400 transition-colors">Documentation</Link>
          <Link href="/login" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-full transition-all shadow-lg shadow-emerald-900/20">
            Login System
          </Link>
        </div>
      </div>
    </nav>
  );
}