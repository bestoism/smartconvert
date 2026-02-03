import Navbar from '@/components/Navbar';
import { ArrowRight, BarChart3, Cpu, Zap, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 text-sm font-bold mb-8 animate-fade-in">
            <Zap size={16} /> Ready for Banking Production v2.0
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            Predict Your Next <br /> High-Value Customer.
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Optimalkan strategi sales perbankan Anda dengan Lead Scoring berbasis AI. 
            Identifikasi nasabah potensial secara akurat sebelum melakukan panggilan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-xl text-lg font-bold transition-all transform hover:scale-105">
              Get Started Now <ArrowRight size={20} />
            </Link>
            <Link href="/docs" className="w-full sm:w-auto border border-white/10 hover:bg-white/5 px-10 py-4 rounded-xl text-lg font-bold transition-all">
              Read Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* --- VALUE PROPOSITION --- */}
      <section className="py-20 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-xl font-bold">Predictive Intelligence</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Menggunakan algoritma XGBoost yang divalidasi ketat untuk memberikan skor probabilitas 0-100% pada setiap calon nasabah.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                <Cpu size={28} />
              </div>
              <h3 className="text-xl font-bold">Explainable AI (XAI)</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Bukan sekadar angka. Kami memberikan alasan (SHAP Values) di balik setiap prediksi untuk membangun kepercayaan tim sales.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-xl font-bold">Enterprise Ready</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Arsitektur Fullstack modern (FastAPI & Next.js) dengan keamanan JWT, siap menangani pemrosesan data massal secara instan.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="mt-auto py-12 px-6 border-t border-white/5 text-center">
        <p className="text-gray-500 text-sm font-medium">
          © 2026 SmartConvert CRM. Developed by Ryan Besto Saragih.
        </p>
      </footer>
    </main>
  );
}