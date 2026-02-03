import Navbar from '@/components/Navbar';
import { 
  FileText, 
  LogIn, 
  UploadCloud, 
  BarChart, 
  ShieldCheck,
  ChevronRight,
  BookOpen,
  ArrowLeft // Import icon panah kiri
} from 'lucide-react';
import Link from 'next/link';

const sections = [
  { id: 'introduction', title: 'Pendahuluan', icon: BookOpen },
  { id: 'access', title: 'Akses Sistem', icon: LogIn },
  { id: 'data-management', title: 'Manajemen Data', icon: UploadCloud },
  { id: 'analysis', title: 'Interpretasi Analitik', icon: BarChart },
  { id: 'security', title: 'Protokol Keamanan', icon: ShieldCheck },
];

export default function DocumentationPage() {
  return (
    <main className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex max-w-7xl mx-auto px-6 pt-24 pb-20 w-full gap-12">
        
        {/* --- SIDEBAR NAVIGATION --- */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-1">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-3">Daftar Isi</p>
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/5 rounded-md transition-all group"
              >
                <section.icon size={16} />
                {section.title}
                <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <div className="flex-1 max-w-3xl">
          
          {/* --- TOMBOL BACK (KEMBALI KE BERANDA) --- */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-500 transition-colors mb-10 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </Link>

          {/* Section: Introduction */}
          <section id="introduction" className="mb-20 scroll-mt-24">
            <div className="inline-flex items-center gap-2 text-emerald-500 mb-4">
              <FileText size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">Dokumentasi v1.0</span>
            </div>
            <h1 className="text-4xl font-bold mb-6 text-white tracking-tight">Panduan Operasional</h1>
            <p className="text-lg text-slate-400 leading-relaxed font-light mb-8">
              SmartConvert CRM adalah infrastruktur analitik yang dirancang khusus untuk tim penjualan perbankan guna memaksimalkan tingkat konversi penempatan deposito berjangka.
            </p>
            <div className="p-6 border border-slate-800 rounded-lg bg-slate-900/50">
              <h3 className="text-emerald-500 font-semibold mb-2 text-sm">Tujuan Utama Sistem</h3>
              <ul className="text-sm text-slate-400 space-y-2 list-disc pl-5 font-light">
                <li>Otomatisasi pemeringkatan prospek nasabah (Lead Scoring).</li>
                <li>Transparansi keputusan model melalui Explainable AI (XAI).</li>
                <li>Optimalisasi alokasi sumber daya pemasaran berbasis data ekonomi makro.</li>
              </ul>
            </div>
          </section>

          {/* Section: Access */}
          <section id="access" className="mb-20 scroll-mt-24 border-t border-slate-900 pt-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
              <LogIn className="text-emerald-500" size={24} /> Akses Sistem
            </h2>
            <p className="text-slate-400 font-light leading-relaxed mb-6">
              Akses diatur secara ketat melalui protokol otentikasi terpusat. Pengguna wajib menggunakan kredensial yang diverifikasi IT.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-800 rounded bg-slate-900/20">
                <p className="text-white font-semibold text-sm mb-1">Login Standar</p>
                <p className="text-xs text-slate-500">Gunakan username dan password terenkripsi.</p>
              </div>
              <div className="p-4 border border-slate-800 rounded bg-slate-900/20">
                <p className="text-white font-semibold text-sm mb-1">Masa Aktif Sesi</p>
                <p className="text-xs text-slate-500">Sesi pengguna berakhir otomatis dalam 24 jam.</p>
              </div>
            </div>
          </section>

          {/* Section: Data Management */}
          <section id="data-management" className="mb-20 scroll-mt-24 border-t border-slate-900 pt-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
              <UploadCloud className="text-emerald-500" size={24} /> Manajemen Data
            </h2>
            <ul className="space-y-4 text-sm text-slate-400 font-light">
              <li className="flex items-center gap-3">
                <CheckCircle2 size={14} className="text-emerald-500" /> Format file wajib <strong>.CSV</strong>.
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={14} className="text-emerald-500" /> Sistem melakukan normalisasi data otomatis saat unggah.
              </li>
            </ul>
          </section>

          {/* Footer Dokumentasi */}
          <div className="pt-20 border-t border-slate-900">
            <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-2 font-bold">Butuh Bantuan?</p>
            <Link href="mailto:support@smartconvert.com" className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors font-medium">
              Hubungi Administrator Sistem
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}

// Tambahkan import CheckCircle2 di atas karena saya pakai di list manajemen data
import { CheckCircle2 } from 'lucide-react';  