"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, Phone, User, MessageSquare, Clock, 
  TrendingUp, CreditCard, ShieldCheck, CheckCircle2,
  XCircle, Loader2, PlayCircle, Info, Save, Check
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function LeadDetailPage() {
  const { id } = useParams();
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("New");
  
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchData = async () => {
    try {
      const res = await api.get(`/leads/${id}`);
      setLead(res.data);
      setNote(res.data.notes || "");
      setStatus(res.data.status || "New");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  // --- FUNGSI UPDATE STATUS SAJA ---
  const handleUpdateStatus = async () => {
    setIsUpdatingStatus(true);
    try {
      await api.put(`/leads/${id}/notes`, { status: status });
      alert("Status nasabah berhasil diperbarui!");
      fetchData();
    } catch (err) {
      alert("Gagal memperbarui status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // --- FUNGSI SIMPAN NOTES SAJA ---
  const handleSaveNote = async () => {
    setIsSavingNote(true);
    try {
      await api.put(`/leads/${id}/notes`, { notes: note });
      alert("Catatan sales berhasil disimpan!");
      fetchData();
    } catch (err) {
      alert("Gagal menyimpan catatan.");
    } finally {
      setIsSavingNote(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="animate-spin text-emerald-500" size={40} />
      <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Securing Connection...</p>
    </div>
  );
  
  if (!lead) return <div className="p-10 text-rose-500 font-bold">Nasabah Tidak Ditemukan.</div>;

  const score = Math.round(lead.prediction_score * 100);

  const getStatusStyle = (s: string) => {
    if (s === 'Interested') return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500';
    if (s === 'Rejected') return 'bg-rose-500/10 border-rose-500/30 text-rose-500';
    if (s === 'In Progress') return 'bg-amber-500/10 border-amber-500/30 text-amber-500';
    return 'bg-blue-500/10 border-blue-500/30 text-blue-500';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20">
      {/* NAVIGATION BAR */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/leads" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-500 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Database
        </Link>
        <div className="text-[10px] font-mono text-slate-700 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
           System Verified • Real-time Data
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM 1: PROFILE & WORKFLOW STATUS */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
             <div className="absolute -top-4 -right-4 opacity-5 rotate-12">
                <ShieldCheck size={120} className="text-emerald-500" />
             </div>
             
             <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 border border-slate-700 shadow-inner">
                    <User size={32} className="text-slate-400" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Nasabah-{lead.id}</h2>
                <div className={`mt-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(status)}`}>
                  {status}
                </div>
             </div>

             <div className="mt-10 space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Workflow Status</label>
                    <select 
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl p-3 outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="New">🟢 New Prospect</option>
                      <option value="In Progress">🟡 In Progress</option>
                      <option value="Interested">🔵 Interested / Closing</option>
                      <option value="Rejected">🔴 Rejected</option>
                    </select>
                </div>
                
                <div className="flex gap-2">
                    <button 
                        onClick={handleUpdateStatus}
                        disabled={isUpdatingStatus || status === lead.status}
                        className="flex-1 bg-slate-100 hover:bg-white text-slate-950 h-11 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-30"
                    >
                        <Check size={16} /> {isUpdatingStatus ? 'Updating...' : 'Update Status'}
                    </button>
                    <button className="w-12 h-11 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/40 transition-all">
                        <Phone size={18} />
                    </button>
                </div>
             </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
             <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800 pb-2">Client Credentials</h4>
             <div className="space-y-4">
                <div className="flex justify-between border-b border-slate-800/50 pb-3">
                   <span className="text-xs text-slate-500">Pekerjaan</span>
                   <span className="text-xs font-bold text-slate-200 capitalize">{lead.job.replace('.', '')}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/50 pb-3">
                   <span className="text-xs text-slate-500">Usia</span>
                   <span className="text-xs font-bold text-slate-200">{lead.age} Tahun</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/50 pb-3">
                   <span className="text-xs text-slate-500">Status Pernikahan</span>
                   <span className="text-xs font-bold text-slate-200 capitalize">{lead.marital}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/50 pb-3">
                   <span className="text-xs text-slate-500">Pendidikan</span>
                   <span className="text-xs font-bold text-slate-200 capitalize">{lead.education}</span>
                </div>
             </div>
          </div>
        </div>

        {/* KOLOM 2: AI BRAIN & SALES LOGS */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center bg-gradient-to-b from-slate-900 to-slate-950">
             <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-8 text-left">AI Engine Confidence</h4>
             <div className="relative w-36 h-36 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-800" />
                  <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="10" fill="transparent" 
                    strokeDasharray={402}
                    strokeDashoffset={402 - (402 * score) / 100}
                    className={`transition-all duration-1000 stroke-linecap-round ${score > 70 ? 'text-emerald-500 shadow-emerald-500' : 'text-amber-500'}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-white tracking-tighter">{score}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Percent</span>
                </div>
             </div>
             <p className={`mt-6 text-xs font-black uppercase tracking-[0.2em] ${score > 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {lead.prediction_label}
             </p>
          </div>

          {/* AI RECOMMENDATION BOX */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 relative">
             <div className="absolute top-4 right-4 animate-pulse">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
             </div>
             <div className="flex items-start gap-4">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500">
                   <TrendingUp size={20} />
                </div>
                <div>
                   <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">Next Best Conversation</h4>
                   <p className="text-sm text-slate-300 leading-relaxed font-medium italic">
                      "{lead.explanation?.recommendation || "Gali kebutuhan nasabah secara umum."}"
                   </p>
                </div>
             </div>
          </div>

          {/* SALES NOTES */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
             <div className="flex justify-between items-center mb-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare size={14} /> Documentation Note
                </h4>
                {lead.updated_at !== lead.created_at && (
                    <span className="text-[9px] text-slate-600 italic">Last modified recently</span>
                )}
             </div>
             <textarea 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-all h-32 placeholder:text-slate-700"
                placeholder="Type interaction results..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
             />
             <button 
                onClick={handleSaveNote}
                disabled={isSavingNote}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white h-11 rounded-xl text-xs font-bold transition-all disabled:opacity-50 shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
             >
                <Save size={16} /> {isSavingNote ? "Securing Data..." : "Save Documentation"}
             </button>
          </div>
        </div>

        {/* KOLOM 3: SHAP IMPACT ANALYSIS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 h-fit">
           <div className="mb-10 text-center lg:text-left">
               <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">AI Logic Transparency</h4>
               <h3 className="text-lg font-bold text-white">Impact Analysis (SHAP)</h3>
           </div>
           
           <div className="space-y-8">
              {lead.explanation?.shap_values.map((item: any, i: number) => (
                <div key={i} className="group">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight group-hover:text-slate-200 transition-colors">
                        {item.feature.replace('_', ' ')}
                      </span>
                      <span className={`text-[10px] font-mono font-bold ${item.impact > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {item.impact > 0 ? '+' : ''}{(item.impact * 100).toFixed(1)}%
                      </span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${item.impact > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ width: `${Math.min(Math.abs(item.impact) * 200, 100)}%` }}
                      />
                   </div>
                </div>
              ))}
           </div>

           <div className="mt-16 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <div className="flex items-center gap-4 text-slate-500">
                 <div className="p-2 bg-slate-800 rounded-lg">
                    <Clock size={16} />
                 </div>
                 <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">Last Contact Context</p>
                    <p className="text-xs font-bold text-slate-400 capitalize">{lead.month} • {lead.contact}</p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}