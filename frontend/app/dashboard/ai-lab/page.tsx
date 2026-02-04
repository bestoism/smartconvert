"use client";

import { useEffect, useState } from 'react';
import { 
  Cpu, ShieldCheck, Zap, Activity, Info, 
  BarChart3, Settings2, Database, BrainCircuit
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

  if (loading) return <div className="p-10 font-mono text-xs text-slate-500 animate-pulse">BOOTING AI ANALYTICS ENGINE...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10 text-slate-100">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <BrainCircuit className="text-indigo-400" size={32} /> AI Insights & Model Lab
        </h1>
        <p className="text-slate-500 text-sm font-light mt-1">
          Pusat kendali operasional dan transparansi algoritma <span className="text-indigo-500/50 font-mono">XGB_CORE_v2</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM 1: MODEL STATUS & METRICS */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full" />
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Model Core Identity</h4>
            <div className="space-y-4">
               <div>
                  <p className="text-[10px] text-slate-600 uppercase">Algorithm</p>
                  <p className="text-lg font-bold text-white">{data.model_name}</p>
               </div>
               <div className="flex justify-between border-t border-slate-800 pt-4">
                  <div>
                    <p className="text-[10px] text-slate-600 uppercase">Status</p>
                    <Badge text="ACTIVE" color="emerald" />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-600 uppercase">Last Retrain</p>
                    <p className="text-xs font-mono text-slate-400">{data.last_trained}</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
             <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Activity size={14} className="text-indigo-400" /> Performance Metrics
             </h4>
             <div className="grid grid-cols-2 gap-4">
                <MetricBox label="Recall" value="64.7%" help="Validitas Deteksi" />
                <MetricBox label="F1-Score" value="0.499" help="Balance Score" />
                <MetricBox label="Precision" value="0.406" help="Efisiensi Tebakan" />
                <MetricBox label="Accuracy" value="85.3%" help="Overall Correct" />
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
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 h-full">
            <div className="flex justify-between items-start mb-10">
               <div>
                  <h4 className="text-white font-bold text-sm">Global Feature Importance (SHAP)</h4>
                  <p className="text-xs text-slate-500 mt-1">Faktor makro yang paling mempengaruhi keputusan AI di seluruh database.</p>
               </div>
               <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800 rounded text-[9px] font-bold text-slate-400">
                     <Database size={10} /> 41.1K ROWS
                  </div>
               </div>
            </div>

            <div className="h-[400px] w-full">
              <ResponsiveContainer>
                <BarChart data={data.feature_importance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 'bold'}} 
                    width={120} 
                  />
                  <Tooltip 
                    cursor={{fill: 'white', opacity: 0.05}}
                    contentStyle={{bg: '#0f172a', border: '1px solid #1e293b'}}
                  />
                  <Bar dataKey="impact" radius={[0, 4, 4, 0]} barSize={20}>
                    {data.feature_importance.map((entry: any, index: number) => (
                      <Cell key={index} fill={entry.type === 'Economic' ? '#818cf8' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-8 flex gap-6">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-400 rounded-sm" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Economic Factors</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-400 rounded-sm" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Campaign & History</span>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function MetricBox({ label, value, help }: any) {
  return (
    <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl text-center">
      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-[8px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">{help}</p>
    </div>
  );
}

function Badge({ text, color }: any) {
  const colors: any = {
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[9px] font-black border ${colors[color]}`}>
      {text}
    </span>
  );
}