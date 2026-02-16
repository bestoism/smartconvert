"use client";

import { useEffect, useState, useRef } from 'react';
import { 
  Users, Upload, Eye, ChevronLeft, ChevronRight, Filter, 
  SlidersHorizontal, RotateCcw, CheckCircle2, Trash2, CheckSquare, Square, X,
  PlayCircle, XCircle, Info
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
// Import useToast
import { useToast } from '@/components/Toast';

export default function LeadsPage() {
  const { showToast } = useToast(); // Inisialisasi Toast
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [foundCount, setFoundCount] = useState(0);
  
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('newest');
  const [uploading, setUploading] = useState(false);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // --- FILTER STATES ---
  const [filterJob, setFilterJob] = useState('');
  const [filterMinScore, setFilterMinScore] = useState('');
  const [filterMinAge, setFilterMinAge] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); 

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      let query = `/leads?skip=${page * limit}&limit=${limit}&sort_by=${sortBy}`;
      if (filterJob) query += `&job=${filterJob}`;
      if (filterMinScore) query += `&min_score=${Number(filterMinScore) / 100}`;
      if (filterMinAge) query += `&min_age=${filterMinAge}`;
      if (filterStatus) query += `&status=${filterStatus}`; 

      const res = await api.get(query);
      setLeads(res.data.data); 
      setFoundCount(res.data.total_found);
      
      const statsRes = await api.get('/dashboard/stats');
      setTotalCount(statsRes.data.total_leads);
    } catch (err) {
      console.error("Fetch error:", err);
      showToast("Gagal mengambil data dari server.", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilterJob('');
    setFilterMinScore('');
    setFilterMinAge('');
    setFilterStatus(''); 
    setSortBy('newest');
    setPage(0);
    setSelectedIds([]);
  };

  useEffect(() => {
    fetchLeads();
    setSelectedIds([]); 
  }, [page, limit, sortBy, filterJob, filterMinScore, filterMinAge, filterStatus]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    try {
      await api.post('/upload-csv', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      showToast("Batch Data Berhasil Diunggah!", "success");
      setPage(0);
      fetchLeads();
    } catch (err) { 
      showToast("Gagal mengunggah file. Cek format CSV Anda.", "error"); 
    }
    finally { setUploading(false); if (e.target) e.target.value = ''; }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === leads.length) { setSelectedIds([]); } 
    else { setSelectedIds(leads.map(l => l.id)); }
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Hapus ${selectedIds.length} data secara permanen?`)) return;
    setIsBulkProcessing(true);
    try {
      await api.post('/leads/bulk-delete', { lead_ids: selectedIds });
      showToast("Data massal berhasil dihapus secara permanen.", "success");
      fetchLeads();
    } catch (err) { 
      showToast("Gagal memproses penghapusan massal.", "error"); 
    }
    finally { setIsBulkProcessing(false); }
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    setIsBulkProcessing(true);
    try {
      await api.post('/leads/bulk-status', { lead_ids: selectedIds, status: newStatus });
      showToast(`Berhasil memperbarui ${selectedIds.length} data nasabah.`, "success");
      fetchLeads();
    } catch (err) { 
      showToast("Gagal memperbarui status massal.", "error"); 
    }
    finally { setIsBulkProcessing(false); }
  };

  const getPotentialStyle = (label: string) => {
    if (label === 'High Potential') return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    if (label === 'Medium Potential') return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
  };

  const getWorkflowStyle = (s: string) => {
    if (s === 'Interested') return 'text-emerald-400 border-emerald-400/30 bg-emerald-500/5';
    if (s === 'Rejected') return 'text-rose-400 border-rose-400/30 bg-rose-500/5';
    if (s === 'In Progress') return 'text-amber-400 border-amber-400/30 bg-amber-500/5';
    return 'text-blue-400 border-blue-400/30 bg-blue-500/5';
  };

  const getStatusIcon = (s: string) => {
    if (s === 'Interested') return <CheckCircle2 size={12} />;
    if (s === 'Rejected') return <XCircle size={12} />;
    if (s === 'In Progress') return <PlayCircle size={12} />;
    return <Info size={12} />;
  };

  const startRange = page * limit + 1;
  const endRange = Math.min((page + 1) * limit, foundCount);

  return (
    <div className="relative space-y-6 animate-in fade-in duration-500 pb-24 text-slate-100 pt-15 lg:pt-0">
      
      {/* FLOATING ACTION BAR */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-emerald-500/50 shadow-2xl px-6 py-4 rounded-2xl flex items-center gap-6 animate-in slide-in-from-bottom-10">
          <div className="flex items-center gap-3 border-r border-slate-700 pr-6">
             <span className="bg-emerald-500 text-slate-950 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black">{selectedIds.length}</span>
             <p className="text-xs font-bold uppercase tracking-widest text-emerald-500">Selected</p>
          </div>
          <div className="flex items-center gap-2">
             <button onClick={() => handleBulkStatusUpdate('In Progress')} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all">Set In Progress</button>
             <button onClick={() => handleBulkStatusUpdate('Interested')} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all">Set Interested</button>
             <button onClick={() => handleBulkStatusUpdate('Rejected')} className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-500 hover:text-white rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all">Set Rejected</button>
             <button onClick={handleBulkDelete} className="p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg ml-2"><Trash2 size={16} /></button>
          </div>
          <button onClick={() => setSelectedIds([])} className="text-slate-500 hover:text-white ml-2"><X size={18}/></button>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3 text-white">
            <Users className="text-emerald-500" size={24} /> Database Leads
          </h1>
          <p className="text-slate-500 text-sm font-light mt-1">Ditemukan {foundCount.toLocaleString()} data nasabah.</p>
        </div>
        <div className="flex gap-2">
            <button onClick={resetFilters} className="p-2 text-slate-500 hover:text-white transition-colors" title="Reset Filters"><RotateCcw size={20}/></button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20">
                {uploading ? 'Processing...' : 'Upload Batch CSV'}
            </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-1">Pekerjaan</label>
            <select value={filterJob} onChange={(e) => {setFilterJob(e.target.value); setPage(0);}} className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 outline-none focus:border-emerald-500 transition-all">
              <option value="">Semua Kategori</option>
              <option value="admin.">Admin</option>
              <option value="blue-collar">Blue Collar</option>
              <option value="retired">Retired</option>
              <option value="student">Student</option>
              <option value="technician">Technician</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-1">Status Alur Kerja</label>
            <select value={filterStatus} onChange={(e) => {setFilterStatus(e.target.value); setPage(0);}} className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 outline-none focus:border-emerald-500 transition-all">
              <option value="">Semua Status</option>
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Interested">Interested</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-1">Min. Score (%)</label>
            <input type="number" placeholder="70" value={filterMinScore} onChange={(e) => {setFilterMinScore(e.target.value); setPage(0);}} className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 outline-none focus:border-emerald-500 transition-all" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-1">Min. Usia</label>
            <input type="number" placeholder="50" value={filterMinAge} onChange={(e) => {setFilterMinAge(e.target.value); setPage(0);}} className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 outline-none focus:border-emerald-500 transition-all" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-1">Urutkan</label>
            <select value={sortBy} onChange={(e) => {setSortBy(e.target.value); setPage(0);}} className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 outline-none focus:border-emerald-500 transition-all">
              <option value="newest">Terbaru</option>
              <option value="score_high">Skor Tertinggi</option>
              <option value="score_low">Skor Terendah</option>
            </select>
          </div>
      </div>

      {/* TABLE DATA */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950/50 border-b border-slate-800">
              <tr>
                <th className="px-6 py-5 w-10">
                  <button onClick={toggleSelectAll} className="text-slate-500 hover:text-emerald-500">
                    {selectedIds.length === leads.length && leads.length > 0 ? <CheckSquare size={18}/> : <Square size={18}/>}
                  </button>
                </th>
                <th className="px-4 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nasabah Profile</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Prediction</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Confidence Score</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr><td colSpan={6} className="py-32 text-center text-xs font-mono text-slate-600 uppercase tracking-[0.3em] animate-pulse">Filtering Data...</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={6} className="py-32 text-center text-xs text-slate-500 italic">No matches found for current status filter.</td></tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className={`hover:bg-white/[0.02] transition-colors group ${selectedIds.includes(lead.id) ? 'bg-emerald-500/[0.03]' : ''}`}>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleSelectOne(lead.id)} className={`${selectedIds.includes(lead.id) ? 'text-emerald-500' : 'text-slate-700'} hover:text-emerald-400`}>
                        {selectedIds.includes(lead.id) ? <CheckSquare size={18}/> : <Square size={18}/>}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-200 capitalize">{lead.job.replace('.', '')}</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-tighter">{lead.age} th • {lead.marital}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[9px] font-black uppercase tracking-widest ${getWorkflowStyle(lead.status)}`}>
                        {getStatusIcon(lead.status)} {lead.status || 'New'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded border uppercase tracking-tighter ${getPotentialStyle(lead.prediction_label)}`}>
                        {lead.prediction_label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 w-36">
                        <span className="text-xs font-mono font-bold text-slate-400 w-8 text-right">{(lead.prediction_score * 100).toFixed(0)}%</span>
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-1000 ${lead.prediction_score > 0.7 ? 'bg-emerald-500' : lead.prediction_score > 0.3 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${lead.prediction_score * 100}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/dashboard/leads/${lead.id}`} className="inline-flex items-center gap-2 text-[10px] font-black text-emerald-500 hover:text-emerald-400 tracking-widest">
                        DETAIL <Eye size={14} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="bg-slate-950/30 px-6 py-5 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Showing {startRange}-{endRange} of {foundCount.toLocaleString()} Results</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-2 border border-slate-800 rounded-lg text-slate-500 hover:bg-slate-800 disabled:opacity-20 transition-all"><ChevronLeft size={16} /></button>
            <div className="bg-slate-800 px-4 py-1.5 rounded-lg text-xs font-bold text-white border border-slate-700">Page {page + 1}</div>
            <button onClick={() => setPage(p => p + 1)} disabled={endRange >= foundCount} className="p-2 border border-slate-800 rounded-lg text-slate-500 hover:bg-slate-800 disabled:opacity-20 transition-all"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}