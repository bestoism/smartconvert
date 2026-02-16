"use client";

import Navbar from '@/components/Navbar';
import { 
  FileText, LogIn, UploadCloud, BarChart, ShieldCheck, 
  ChevronRight, BookOpen, ArrowLeft, CheckCircle2, 
  Zap, BrainCircuit, Users, MousePointer2, 
  Database, Activity, Terminal, Info
} from 'lucide-react';
import Link from 'next/link';

const sections = [
  { id: 'introduction', title: 'Pendahuluan', icon: BookOpen },
  { id: 'auth', title: 'Otentikasi & Keamanan', icon: ShieldCheck },
  { id: 'dashboard', title: 'Executive Dashboard', icon: BarChart },
  { id: 'leads', title: 'Manajemen Data Prospek', icon: Users },
  { id: 'xai', title: 'Explainable AI (SHAP)', icon: BrainCircuit },
  { id: 'simulator', title: 'AI What-If Simulator', icon: Zap },
  { id: 'profile', title: 'Performa Staf Sales', icon: Activity },
];

export default function DocumentationPage() {
  return (
    <main className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-20 w-full gap-12">
        
        {/* --- SIDEBAR NAVIGATION (Hanya Muncul di Desktop) --- */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-24 space-y-1 bg-slate-900/20 p-4 rounded-2xl border border-slate-800">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Struktur Dokumentasi</p>
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/5 rounded-xl transition-all group"
              >
                <section.icon size={16} />
                {section.title}
                <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <div className="flex-1 max-w-4xl overflow-hidden">
          
          {/* BACK BUTTON */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-500 transition-colors mb-10 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </Link>

          {/* SECTION: INTRODUCTION */}
          <section id="introduction" className="mb-24 scroll-mt-24">
            <div className="inline-flex items-center gap-2 text-emerald-500 mb-6">
              <Terminal size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Manual v2.0.4</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight">
              Infrastruktur Analitik <br className="hidden md:block"/> SmartConvert CRM
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed font-light mb-8">
              SmartConvert CRM adalah platform manajemen hubungan pelanggan berbasis kecerdasan buatan yang dirancang khusus untuk sektor perbankan. 
              Sistem ini bertujuan mentransformasi data mentah kampanye deposito menjadi instruksi kerja yang presisi bagi tim pemasaran.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="p-5 border border-slate-800 rounded-2xl bg-slate-900/30">
                  <h4 className="text-emerald-500 font-bold text-xs uppercase mb-3">Core Engine</h4>
                  <p className="text-slate-400 text-sm font-light">Didorong oleh algoritma XGBoost yang tervalidasi bebas dari bias durasi (Data Leakage).</p>
               </div>
               <div className="p-5 border border-slate-800 rounded-2xl bg-slate-900/30">
                  <h4 className="text-emerald-500 font-bold text-xs uppercase mb-3">Transparency</h4>
                  <p className="text-slate-400 text-sm font-light">Implementasi SHAP (SHapley Additive exPlanations) untuk akuntabilitas prediksi.</p>
               </div>
            </div>
          </section>

          {/* SECTION: AUTHENTICATION */}
          <section id="auth" className="mb-24 scroll-mt-24 border-t border-slate-900 pt-16">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
              <ShieldCheck className="text-emerald-500" size={28} /> Otentikasi & Keamanan Data
            </h2>
            <div className="space-y-6">
              <p className="text-slate-400 font-light leading-relaxed">
                Keamanan adalah prioritas utama kami. Akses ke dalam database leads diproteksi dengan beberapa lapis keamanan teknis:
              </p>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="mt-1 h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <div>
                    <strong className="text-slate-200 block mb-1">JWT Authorization</strong>
                    <p className="text-sm text-slate-500 font-light">Setiap akses API wajib menyertakan token JWT yang valid. Token akan kedaluwarsa secara otomatis dalam 24 jam untuk memitigasi risiko pembajakan sesi.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1 h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <div>
                    <strong className="text-slate-200 block mb-1">Password Hashing</strong>
                    <p className="text-sm text-slate-500 font-light">Kredensial pengguna tidak disimpan dalam teks polos, melainkan dienkripsi menggunakan algoritma Bcrypt yang aman dari serangan brute-force.</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* SECTION: DASHBOARD */}
          <section id="dashboard" className="mb-24 scroll-mt-24 border-t border-slate-900 pt-16">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
              <BarChart className="text-emerald-500" size={28} /> Executive Dashboard
            </h2>
            <p className="text-slate-400 font-light leading-relaxed mb-8">
              Dasbor analitik memberikan gambaran helikopter mengenai performa kampanye saat ini. Terdapat tiga jenis visualisasi utama yang wajib dipahami oleh manajer operasional:
            </p>
            <div className="space-y-4">
              <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                <Badge text="AI Insight" color="blue" />
                <h4 className="text-white font-bold mt-3 mb-2">Confidence Distribution</h4>
                <p className="text-sm text-slate-500 font-light italic">Menampilkan sebaran probabilitas konversi. Puncak pada rentang 81-100% menandakan database yang sangat potensial.</p>
              </div>
              <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                <Badge text="Market Insight" color="purple" />
                <h4 className="text-white font-bold mt-3 mb-2">Job & Demographic Distribution</h4>
                <p className="text-sm text-slate-500 font-light italic">Mengidentifikasi segmen profesi mana yang paling dominan dalam kampanye berjalan untuk penyesuaian strategi komunikasi.</p>
              </div>
            </div>
          </section>

          {/* SECTION: LEADS MANAGEMENT */}
          <section id="leads" className="mb-24 scroll-mt-24 border-t border-slate-900 pt-16">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
              <Users className="text-emerald-500" size={28} /> Manajemen Data Prospek
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
               <div>
                  <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <UploadCloud size={14} /> Batch Processing
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">
                    Unggah file nasabah (format .CSV) untuk diproses oleh AI secara massal. Sistem mampu menangani ribuan data dalam hitungan detik, mencakup pembersihan dan normalisasi kolom otomatis.
                  </p>
               </div>
               <div>
                  <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <MousePointer2 size={14} /> Bulk Operations
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">
                    Gunakan fitur seleksi massal untuk memperbarui status pengerjaan nasabah atau menghapus data yang tidak relevan secara efisien dari grid utama.
                  </p>
               </div>
            </div>
          </section>

          {/* SECTION: XAI */}
          <section id="xai" className="mb-24 scroll-mt-24 border-t border-slate-900 pt-16">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
              <BrainCircuit className="text-emerald-500" size={28} /> Explainable AI (XAI)
            </h2>
            <div className="bg-emerald-500/5 border border-emerald-500/10 p-8 rounded-3xl mb-8">
              <p className="text-slate-300 font-medium mb-6">Cara Membaca Analisis Dampak SHAP:</p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-2 w-12 bg-emerald-500 rounded-full" />
                  <p className="text-xs text-slate-400"><strong className="text-emerald-400">Batang Hijau (Positif):</strong> Faktor yang meningkatkan probabilitas nasabah untuk berlangganan.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-12 bg-rose-500 rounded-full" />
                  <p className="text-xs text-slate-400"><strong className="text-rose-400">Batang Merah (Negatif):</strong> Faktor yang menurunkan minat atau probabilitas nasabah.</p>
                </div>
              </div>
            </div>
            <p className="text-slate-400 font-light text-sm">
              Fitur ini sangat penting bagi staf sales untuk memahami alasan spesifik (seperti suku bunga Euribor atau pekerjaan nasabah) sebelum memulai percakapan.
            </p>
          </section>

          {/* SECTION: SIMULATOR */}
          <section id="simulator" className="mb-24 scroll-mt-24 border-t border-slate-900 pt-16">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
              <Zap className="text-yellow-400" size={28} /> AI What-If Simulator
            </h2>
            <p className="text-slate-400 font-light leading-relaxed mb-8">
              Gunakan simulator untuk merencanakan skenario kampanye masa depan. Geser parameter ekonomi (seperti Suku Bunga) atau ubah profil nasabah secara manual untuk melihat perubahan skor secara real-time.
            </p>
            <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
               <Info size={16} className="text-yellow-500 shrink-0" />
               <p className="text-[10px] text-yellow-500/80 font-bold uppercase tracking-widest leading-none">Tool ini khusus digunakan oleh manajer strategi pemasaran.</p>
            </div>
          </section>

          {/* SECTION: PROFILE */}
          <section id="profile" className="mb-24 scroll-mt-24 border-t border-slate-900 pt-16">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
              <Activity className="text-emerald-500" size={28} /> Pemantauan Performa Sales
            </h2>
            <p className="text-slate-400 font-light leading-relaxed mb-10">
              Menu 'My Profile' menyajikan laporan transparansi kerja staf sales secara individu, mencakup:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                  <h5 className="text-white text-xs font-bold mb-1">Live Activity Logs</h5>
                  <p className="text-xs text-slate-500">Rekam jejak setiap aksi yang dilakukan oleh user terhadap database.</p>
               </div>
               <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                  <h5 className="text-white text-xs font-bold mb-1">Conversion Tracking</h5>
                  <p className="text-xs text-slate-500">Statistik real-time mengenai berapa banyak nasabah potensial yang telah dikelola.</p>
               </div>
            </div>
          </section>

          {/* FINAL FOOTER */}
          <div className="pt-20 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
               <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1 font-bold">Butuh Bantuan Teknis?</p>
               <Link href="mailto:it@smartconvert.com" className="text-sm text-emerald-500 hover:text-emerald-400 font-medium">
                it-support@smartconvert.com
               </Link>
            </div>
            <div className="text-center md:text-right">
               <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Infrastruktur Oleh</p>
               <p className="text-sm text-slate-300 font-bold">Ryan Besto Saragih • 2026</p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

function Badge({ text, color }: { text: string, color: string }) {
  const styles: any = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[9px] font-black border uppercase tracking-widest ${styles[color]}`}>
      {text}
    </span>
  );
}