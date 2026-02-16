"use client";

import { useEffect, useState } from 'react';
import { 
  Cpu, ShieldCheck, Zap, Activity, Info, 
  BarChart3, Settings2, Database, BrainCircuit, Loader2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid 
} from 'recharts';
import api from '@/lib/api';

export default function AILabPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAI = async () => {
      try {
        const res = await api.get('/ai/insights');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAI();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="animate-spin text-indigo-500" size={32} />
      <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.3em]">Booting AI Analytics Engine...</p>
    </div>
  );

  return (
    // Tambahkan pt-20 di mobile (base) agar tidak tertutup Hamburger Nav h-16
    // Tambahkan px-4 di mobile agar tidak mepet ke pinggir layar
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 text-slate-100 pt-15 lg:pt-0 px-4 md:px-0">
      
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
          <BrainCircuit className="text-indigo-400" size={28} /> AI Insights & Model Lab
        </h1>
        <p className="text-slate-500 text-xs md:text-sm font-light mt-1">
          Pusat kendali operasional dan transparansi algoritma <span className="text-indigo-500/50 font-mono">XGB_CORE_v2</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM 1: MODEL STATUS & METRICS */}
        <div className="lg:col-span-1 space-y-6">
          {/* Identity Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full" />
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Model Core Identity</h4>
            <div className="space-y-4">
               <div>
                  <p className="text-[9px] text-slate-600 uppercase font-bold">Algorithm</p>
                  <p className="text-md md:text-lg font-bold text-white tracking-tight">{data.model_name}</p>
               </div>
               <div className="flex justify-between border-t border-slate-800 pt-4 items-center">
                  <div>
                    <p className="text-[9px] text-slate-600 uppercase font-bold mb-1">Status</p>
                    <CustomBadge text="ACTIVE" color="emerald" />
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-slate-600 uppercase font-bold mb-1">Last Retrain</p>
                    <p className="text-[10px] font-mono text-slate-400">{data.last_trained}</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Metrics Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
             <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Activity size={14} className="text-indigo-400" /> Performance Metrics
             </h4>
             <div className="grid grid-cols-2 gap-3 md:gap-4">
                <MetricBox label="Recall" value="64.7%" help="Validitas" />
                <MetricBox label="F1-Score" value="0.499" help="Balance" />
                <MetricBox label="Precision" value="0.406" help="Efisiensi" />
                <MetricBox label="Accuracy" value="85.3%" help="Correctness" />
             </div>
             <div className="mt-6 p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
                <p className="text-[10px] text-indigo-300 leading-relaxed italic">
                   "Model ini telah dioptimasi untuk memitigasi isu data leakage (fitur durasi dihapus)."
                </p>
             </div>
          </div>
        </div>

        {/* KOLOM 2 & 3: GLOBAL FEATURE IMPORTANCE (SHAP) */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 h-full shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10">
               <div>
                  <h4 className="text-white font-bold text-sm">Global Feature Importance (SHAP)</h4>
                  <p className="text-xs text-slate-500 mt-1">Faktor makro yang paling mempengaruhi keputusan AI.</p>
               </div>
               <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 rounded text-[9px] font-bold text-slate-400 w-fit">
                  <Database size={10} /> 41.1K RECORDS
               </div>
            </div>

            {/* CHART CONTAINER - Kita atur tinggi dinamis agar di mobile tidak terpotong */}
            <div className="h-[350px] md:h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.feature_importance} layout="vertical" margin={{ left: -20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    // Perkecil ukuran font tick di mobile agar muat
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} 
                    width={110} 
                  />
                  <Tooltip 
                    cursor={{fill: 'white', opacity: 0.05}}
                    // PERBAIKAN: Ganti 'bg' menjadi 'backgroundColor' agar build sukses
                    contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px'}}
                    itemStyle={{fontSize: '12px'}}
                  />
                  <Bar dataKey="impact" radius={[0, 4, 4, 0]} barSize={16}>
                    {data.feature_importance.map((entry: any, index: number) => (
                      <Cell key={index} fill={entry.type === 'Economic' ? '#818cf8' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* LEGEND */}
            <div className="mt-8 flex flex-wrap gap-4 md:gap-6 border-t border-slate-800 pt-6">
               <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-indigo-400 rounded-sm" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Economic Factors</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-sm" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Campaign & History</span>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- REUSABLE HELPER COMPONENTS ---

function MetricBox({ label, value, help }: any) {
  return (
    <div className="bg-slate-950/50 border border-slate-800 p-3 md:p-4 rounded-xl text-center hover:border-indigo-500/30 transition-colors">
      <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-lg md:text-xl font-bold text-white">{value}</p>
      <p className="text-[7px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">{help}</p>
    </div>
  );
}

function CustomBadge({ text, color }: any) {
  const colors: any = {
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
  };
  return (
    <span className={`px-2 py-0.5 rounded-[4px] text-[9px] font-black border ${colors[color]}`}>
      {text}
    </span>
  );
}