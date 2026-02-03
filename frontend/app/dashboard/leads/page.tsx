"use client";

import { useEffect, useState, useRef } from 'react';
import { 
  Users, 
  Search, 
  Upload, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  ArrowUpDown,
  Download
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  // State untuk Kontrol Tabel
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('newest');
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      // Ambil data leads dengan pagination & sorting
      const res = await api.get(`/leads?skip=${page * limit}&limit=${limit}&sort_by=${sortBy}`);
      setLeads(res.data);
      
      // Ambil total count dari stats untuk keperluan pagination info
      const statsRes = await api.get('/dashboard/stats');
      setTotalCount(statsRes.data.total_leads);
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page, limit, sortBy]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      await api.post('/upload-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Batch Data Berhasil Diunggah!");
      setPage(0);
      fetchLeads();
    } catch (err) {
      alert("Gagal mengunggah file. Pastikan format CSV benar.");
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (label: string) => {
    if (label === 'High Potential') return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    if (label === 'Medium Potential') return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
  };

  const startRange = page * limit + 1;
  const endRange = Math.min((page + 1) * limit, totalCount);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER AREA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <Users className="text-emerald-500" size={24} /> Database Leads Nasabah
          </h1>
          <p className="text-slate-500 text-sm font-light mt-1">
            Manajemen data prospek kampanye deposito berjangka.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input 
            type="file" ref={fileInputRef} onChange={handleFileUpload} 
            accept=".csv" className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-slate-100 text-slate-950 px-4 py-2 rounded-md text-sm font-bold hover:bg-white transition-all disabled:opacity-50"
          >
            <Upload size={16} /> {uploading ? 'Processing...' : 'Upload Batch CSV'}
          </button>
        </div>
      </div>

      {/* FILTER & CONTROL BAR */}
      <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between gap-4 items-center">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest font-bold">
            <Filter size={14} /> Sort By:
          </div>
          <select 
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(0); }}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-md px-3 py-1.5 focus:outline-none focus:border-emerald-500 transition-colors"
          >
            <option value="newest">Data Terbaru</option>
            <option value="oldest">Data Terlama</option>
            <option value="score_high">Skor Tertinggi</option>
            <option value="score_low">Skor Terendah</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs text-slate-500 font-medium">
            Show:
          </div>
          <select 
            value={limit}
            onChange={(e) => { setLimit(Number(e.target.value)); setPage(0); }}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-md px-2 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            <option value={10}>10 Leads</option>
            <option value={25}>25 Leads</option>
            <option value={50}>50 Leads</option>
          </select>
        </div>
      </div>

      {/* TABLE DATA */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950/50 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nasabah Profile</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Prediction</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Confidence Score</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="inline-block w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-2" />
                    <p className="text-xs text-slate-600 font-mono uppercase tracking-widest">Fetching Encrypted Records...</p>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">#{lead.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-200 capitalize">{lead.job.replace('.', '')}</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-tighter">{lead.marital} • {lead.education}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-tighter ${getStatusColor(lead.prediction_label)}`}>
                        {lead.prediction_label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 justify-center">
                        <span className="text-xs font-mono font-bold text-slate-400 w-8 text-right">
                          {(lead.prediction_score * 100).toFixed(0)}%
                        </span>
                        <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${
                              lead.prediction_score > 0.7 ? 'bg-emerald-500' : 
                              lead.prediction_score > 0.3 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${lead.prediction_score * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/dashboard/leads/${lead.id}`}
                        className="inline-flex items-center gap-2 text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors"
                      >
                        VIEW DETAIL <Eye size={14} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="bg-slate-950/30 px-6 py-4 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            Showing <span className="text-slate-200 font-bold">{startRange}-{endRange}</span> of <span className="text-slate-200 font-bold">{totalCount.toLocaleString()}</span> entries
          </p>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-2 border border-slate-800 rounded-md text-slate-400 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="px-4 py-1.5 bg-slate-800 rounded text-xs font-bold text-white">
              Page {page + 1}
            </div>
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={endRange >= totalCount}
              className="p-2 border border-slate-800 rounded-md text-slate-400 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}