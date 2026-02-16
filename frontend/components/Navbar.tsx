"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Helper untuk menutup menu
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="fixed w-full z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LOGO AREA */}
        <Link href="/" className="flex items-center gap-2 group outline-none" onClick={closeMenu}>
          <ShieldCheck 
            className="text-emerald-500 group-hover:scale-110 transition-transform duration-300" 
            size={24} 
          />
          <span className="text-xl font-bold tracking-tight text-slate-100 uppercase group-hover:text-emerald-400 transition-colors duration-300">
            SmartConvert
          </span>
        </Link>
        
        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            href="/documentation" 
            className="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors duration-300"
          >
            Documentation
          </Link>
          <Link 
            href="/login" 
            className="text-sm font-semibold bg-emerald-600 text-white px-5 py-2.5 rounded-md hover:bg-emerald-500 transition-all duration-300 active:scale-95 shadow-md shadow-emerald-900/20"
          >
            System Access
          </Link>
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="text-slate-300 hover:text-emerald-500 transition-colors p-2 rounded-lg hover:bg-slate-900"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {/* Gunakan kombinasi kelas untuk animasi yang lebih halus */}
      <div 
        className={`md:hidden bg-slate-950/95 border-b border-slate-800 transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-8 space-y-6">
          <Link 
            href="/documentation" 
            onClick={closeMenu}
            className="block text-lg font-medium text-slate-300 hover:text-emerald-400 transition-colors"
          >
            Documentation
          </Link>
          <Link 
            href="/login" 
            onClick={closeMenu}
            className="block w-full text-center py-4 bg-emerald-600 text-white font-bold rounded-lg shadow-lg shadow-emerald-900/20 active:scale-[0.98] transition-transform"
          >
            System Access
          </Link>
        </div>
      </div>
    </nav>
  );
}