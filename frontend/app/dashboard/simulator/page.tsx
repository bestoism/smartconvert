"use client";

import { useState, useEffect } from 'react';
import { 
  Zap, RefreshCcw, Info, TrendingUp, 
  User, Globe, Sliders, BrainCircuit 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import api from '@/lib/api';

export default function SimulatorPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // --- STATE UNTUK FORM INPUT ---
  const [inputs, setInputs] = useState({
    age: 30,
    job: 'admin.',
    marital: 'married',
    education: 'university.degree',
    default: 'no',
    housing: 'no',
    loan: 'no',
    contact: 'cellular',
    month: 'may',
    day_of_week: 'mon',
    campaign: 1,
    pdays: 999,
    previous: 0,
    poutcome: 'nonexistent',
    emp_var_rate: 1.1,
    cons_price_idx: 93.994,
    cons_conf_idx: -36.4,
    euribor3m: 4.857,
    nr_employed: 5191
  });

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await api.post('/ai/simulate', inputs);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Jalankan simulasi otomatis saat ada input yang berubah (Real-time)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      runSimulation();
    }, 500); // Delay agar tidak terlalu banyak hit API saat geser slider
    return () => clearTimeout(delayDebounceFn);
  }, [inputs]);

  const score = result ? Math.round(result.score * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 text-slate-100 pt-15 lg:pt-0">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Zap className="text-yellow-400 fill-yellow-400" size={32} /> What-If Simulator
          </h1>
          <p className="text-slate-500 text-sm font-light mt-1">Simulasikan profil nasabah dan lihat probabilitas konversi secara instan.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* KOLOM KIRI: PARAMETER INPUT (8 COL) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8 shadow-sm">
            
            {/* Demographic Section */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <User size={12}/> Demographic Parameters
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 flex justify-between">
                     Age <span>{inputs.age} years</span>
                  </label>
                  <input 
                    type="range" min="18" max="95" step="1" 
                    className="w-full accent-emerald-500"
                    value={inputs.age} onChange={(e) => setInputs({...inputs, age: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Occupation (Job)</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-emerald-500"
                    value={inputs.job} onChange={(e) => setInputs({...inputs, job: e.target.value})}
                  >
                    <option value="admin.">Admin</option>
                    <option value="blue-collar">Blue Collar</option>
                    <option value="retired">Retired</option>
                    <option value="student">Student</option>
                    <option value="management">Management</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Economic Context Section */}
            <div className="space-y-6 pt-6 border-t border-slate-800">
               <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <Globe size={12}/> Economic Climate Context
               </h4>
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 flex justify-between">
                       Euribor 3M Index <span>{inputs.euribor3m}%</span>
                    </label>
                    <input 
                      type="range" min="0.5" max="5.5" step="0.1" 
                      className="w-full accent-orange-500"
                      value={inputs.euribor3m} onChange={(e) => setInputs({...inputs, euribor3m: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 flex justify-between">
                       Employment Rate <span>{inputs.nr_employed}k</span>
                    </label>
                    <input 
                      type="range" min="4900" max="5300" step="1" 
                      className="w-full accent-blue-500"
                      value={inputs.nr_employed} onChange={(e) => setInputs({...inputs, nr_employed: parseInt(e.target.value)})}
                    />
                  </div>
               </div>
            </div>

            {/* Campaign History Section */}
            <div className="space-y-6 pt-6 border-t border-slate-800">
               <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <Sliders size={12}/> Campaign History
               </h4>
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Previous Outcome</label>
                    <select 
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-emerald-500"
                      value={inputs.poutcome} onChange={(e) => setInputs({...inputs, poutcome: e.target.value})}
                    >
                      <option value="nonexistent">New Contact</option>
                      <option value="success">Past Success</option>
                      <option value="failure">Past Failure</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Contact Method</label>
                    <select 
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-emerald-500"
                      value={inputs.contact} onChange={(e) => setInputs({...inputs, contact: e.target.value})}
                    >
                      <option value="cellular">Cellular Phone</option>
                      <option value="telephone">Fixed Telephone</option>
                    </select>
                  </div>
               </div>
            </div>

          </div>
        </div>

        {/* KOLOM KANAN: LIVE RESULTS (5 COL) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center sticky top-24 shadow-2xl shadow-emerald-950/20">
             <div className="mb-6 flex items-center justify-center gap-2">
                <BrainCircuit className="text-emerald-500" size={16}/>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">AI Live Prediction</span>
             </div>

             {/* Animated Gauge */}
             <div className="relative w-40 h-40 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                  <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="12" fill="transparent" 
                    strokeDasharray={452.4}
                    strokeDashoffset={452.4 - (452.4 * score) / 100}
                    className={`transition-all duration-700 stroke-linecap-round ${score > 70 ? 'text-emerald-500' : 'text-amber-500'}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-white tracking-tighter">{score}</span>
                  <span className="text-[10px] font-bold text-slate-500">PROBABILITY</span>
                </div>
             </div>

             <div className={`mt-8 py-2 rounded-lg text-xs font-black uppercase tracking-[0.2em] border ${score > 70 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
                {result?.label}
             </div>

             {/* MINI SHAP BAR CHART FOR SIMULATOR */}
             <div className="mt-12 space-y-4 text-left">
                <h4 className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-4">Driving Factors</h4>
                {result?.explanation?.shap_values.slice(0, 3).map((item: any, i: number) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[10px] uppercase">
                       <span className="text-slate-400">{item.feature.replace('_', ' ')}</span>
                       <span className={item.impact > 0 ? 'text-emerald-500' : 'text-rose-500'}>
                         {item.impact > 0 ? '+' : ''}{(item.impact * 100).toFixed(1)}%
                       </span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                       <div className={`h-full ${item.impact > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${Math.min(Math.abs(item.impact) * 200, 100)}%` }} />
                    </div>
                  </div>
                ))}
             </div>

             {loading && (
               <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <RefreshCcw className="text-emerald-500 animate-spin" size={32} />
               </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
}