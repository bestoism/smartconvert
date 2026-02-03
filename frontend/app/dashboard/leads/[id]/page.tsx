"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Phone, 
  User, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function LeadDetailPage() {
  const { id } = useParams();
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const res = await api.get(`/leads/${id}`);
      setLead(res.data);
      setNote(res.data.notes || "");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleSaveNote = async () => {
    setSaving(true);
    try {
      await api.put(`/leads/${id}/notes`, { notes: note });
      alert("Catatan berhasil disimpan!");
    } catch (err) {
      alert("Gagal menyimpan catatan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-slate-500 font-mono">Decrypting Lead Profile...</div>;
  if (!lead) return <div className="p-10 text-rose-500 font-bold">Nasabah Tidak Ditemukan.</div>;

  const score = Math.round(lead.prediction_score * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* HEADER */}
      <Link href="/dashboard/leads" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-500 transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Kembali ke Database Leads
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM 1: PROFILE & IDENTITY */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck size={80} className="text-emerald-500" />
             </div>
             
             <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                <User size={32} className="text-emerald-500" />
             </div>
             
             <h2 className="text-xl font-bold text-white">Nasabah-{lead.id}</h2>
             <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest mt-1">ID: IAP-{lead.id}-2025-SYSTEM</p>
             
             <div className="mt-4 inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">
                {lead.job.replace('.', '')}
             </div>

             <button className="w-full mt-8 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/50">
                <Phone size={18} /> Call Customer
             </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
             <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Informasi Nasabah</h4>
             <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div><p className="text-[10px] text-slate-600 uppercase">Usia</p><p className="text-sm font-bold text-slate-200">{lead.age} Tahun</p></div>
                   <div><p className="text-[10px] text-slate-600 uppercase">Status</p><p className="text-sm font-bold text-slate-200 capitalize">{lead.marital}</p></div>
                </div>
                <div className="border-t border-slate-800 pt-4">
                   <p className="text-[10px] text-slate-600 uppercase mb-2">Financial Status</p>
                   <div className="space-y-3">
                      <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                         <span className="text-xs text-slate-400 flex items-center gap-2"><CreditCard size={12}/> Housing Loan</span>
                         <span className="text-xs font-bold text-slate-200 uppercase">{lead.housing}</span>
                      </div>
                      <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                         <span className="text-xs text-slate-400 flex items-center gap-2"><CreditCard size={12}/> Personal Loan</span>
                         <span className="text-xs font-bold text-slate-200 uppercase">{lead.loan}</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* KOLOM 2: AI ENGINE & NOTES */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
             <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 text-left">AI Conversion Score</h4>
             
             {/* Custom SVG Circle Progress */}
             <div className="relative w-32 h-32 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                    strokeDasharray={364.4}
                    strokeDashoffset={364.4 - (364.4 * score) / 100}
                    className={`transition-all duration-1000 ${score > 70 ? 'text-emerald-500' : 'text-amber-500'}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{score}<span className="text-xs text-slate-500">/100</span></span>
                </div>
             </div>

             <div className={`mt-6 text-sm font-bold uppercase tracking-widest ${score > 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {lead.prediction_label}
             </div>
             <p className="text-[10px] text-slate-600 mt-1">Sistem menganalisis 46 indikator prediktif</p>
          </div>

          <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-6">
             <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                   <TrendingUp size={18} />
                </div>
                <div>
                   <h4 className="text-xs font-bold text-emerald-200 uppercase tracking-widest mb-1">AI Recommendation</h4>
                   <p className="text-sm text-slate-300 leading-relaxed font-light italic italic-font">
                      "{lead.explanation?.recommendation || "Gali kebutuhan nasabah secara umum."}"
                   </p>
                </div>
             </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
             <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <MessageSquare size={14} /> Sales Notes
             </h4>
             <textarea 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-all h-32"
                placeholder="Tulis hasil follow-up nasabah di sini..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
             />
             <button 
                onClick={handleSaveNote}
                disabled={saving}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
             >
                {saving ? "Menyimpan..." : "Simpan Catatan"}
             </button>
          </div>
        </div>

        {/* KOLOM 3: SHAP ANALYSIS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
           <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-8">AI Analysis (SHAP Impact)</h4>
           
           <div className="space-y-6">
              {lead.explanation?.shap_values.map((item: any, i: number) => (
                <div key={i} className="space-y-2">
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-slate-400 capitalize">{item.feature.replace('_', ' ')}</span>
                      <span className={`text-[10px] font-bold ${item.impact > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {item.impact > 0 ? '+' : ''}{(item.impact * 100).toFixed(1)}%
                      </span>
                   </div>
                   <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.impact > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ width: `${Math.min(Math.abs(item.impact) * 200, 100)}%` }}
                      />
                   </div>
                </div>
              ))}
           </div>

           <div className="mt-10 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-3 text-slate-500">
                 <Clock size={16} />
                 <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest">Last Campaign Contact</p>
                    <p className="text-xs font-bold text-slate-200 capitalize">{lead.month} • {lead.contact}</p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

// Tambahan import yang tertinggal
import { ShieldCheck } from 'lucide-react';