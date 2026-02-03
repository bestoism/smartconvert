"use client";

import { useEffect, useState } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Target, 
  Award, 
  TrendingUp, 
  BarChart3, 
  Clock, 
  Edit3, 
  X,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/user/profile');
      setProfile(res.data);
      setFormData(res.data);
    } catch (err) {
      console.error("Gagal memuat profil:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put('/user/profile', formData);
      await fetchProfile();
      setIsModalOpen(false);
      alert("Profil berhasil diperbarui!");
    } catch (err) {
      alert("Gagal memperbarui profil.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-slate-500 font-mono">Loading User Identity...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight text-emerald-500">My Profile</h1>
          <p className="text-slate-500 text-sm font-light mt-1">Kelola identitas dan pantau performa sales Anda.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md text-xs font-bold border border-slate-700 transition-all"
        >
          <Edit3 size={14} /> Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM 1: KARTU IDENTITAS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 h-fit">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-900/20 rotate-3">
              <span className="text-4xl font-bold text-slate-950 -rotate-3">{profile.name.charAt(0)}</span>
            </div>
            <h2 className="text-xl font-bold text-white">{profile.name}</h2>
            <p className="text-sm text-emerald-500 font-medium mt-1">{profile.role}</p>
          </div>

          <div className="mt-10 space-y-6">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Employee ID</p>
              <div className="flex items-center gap-3 text-slate-300">
                <Award size={16} className="text-emerald-500" />
                <span className="text-sm font-mono">{profile.id_emp}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Email Address</p>
              <div className="flex items-center gap-3 text-slate-300">
                <Mail size={16} className="text-emerald-500" />
                <span className="text-sm">{profile.email}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Joined Date</p>
              <div className="flex items-center gap-3 text-slate-300">
                <Calendar size={16} className="text-emerald-500" />
                <span className="text-sm">{profile.joined_date}</span>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM 2 & 3: STATS & LOGS */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* STATS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 size={18} className="text-blue-400" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Processed</span>
              </div>
              <p className="text-2xl font-bold text-white">{profile.stats.leads_processed}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp size={18} className="text-emerald-400" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Conv. Rate</span>
              </div>
              <p className="text-2xl font-bold text-white">{profile.stats.conversion_rate}%</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Clock size={18} className="text-orange-400" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Active Days</span>
              </div>
              <p className="text-2xl font-bold text-white">{profile.active_days} Days</p>
            </div>
          </div>

          {/* TARGET CARD */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Target className="text-rose-500" size={20} />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Monthly Sales Target</h4>
              </div>
              <span className="text-sm font-bold text-rose-500">
                {profile.stats.current_progress} / {profile.monthly_target} <span className="text-[10px] text-slate-600 ml-1">LEADS</span>
              </span>
            </div>
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-rose-500 transition-all duration-1000"
                style={{ width: `${Math.min((profile.stats.current_progress / profile.monthly_target) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 font-light italic">Target dihitung berdasarkan akumulasi nasabah berstatus 'High Potential'.</p>
          </div>

          {/* ACTIVITY LOGS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 bg-slate-950/30">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Activity Logs</h4>
            </div>
            <div className="divide-y divide-slate-800/50">
              {profile.recent_activities.map((act: any, i: number) => (
                <div key={i} className="p-4 hover:bg-white/[0.01] transition-all flex items-center justify-between group">
                  <div className="flex gap-4 items-start">
                    <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <div>
                      <p className="text-xs text-slate-200 font-medium">{act.content}</p>
                      <p className="text-[10px] text-slate-600 font-mono mt-0.5">{act.time}</p>
                    </div>
                  </div>
                  <Link href={`/dashboard/leads/${act.lead_id}`} className="p-2 text-slate-600 hover:text-emerald-500 transition-colors opacity-0 group-hover:opacity-100">
                    <ChevronRight size={18} />
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* --- CUSTOM MODAL (TAILWIND) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Update Sales Identity</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white"><X size={20}/></button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Full Name</label>
                <input 
                  className="w-full bg-slate-950 border border-slate-800 rounded-md py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-emerald-500 transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Professional Role</label>
                <input 
                  className="w-full bg-slate-950 border border-slate-800 rounded-md py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-emerald-500 transition-all"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Monthly Target (Leads)</label>
                <input 
                  type="number"
                  className="w-full bg-slate-950 border border-slate-800 rounded-md py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-emerald-500 transition-all"
                  value={formData.monthly_target}
                  onChange={(e) => setFormData({...formData, monthly_target: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-800 text-white font-bold py-2.5 rounded-lg text-xs hover:bg-slate-700"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-emerald-600 text-white font-bold py-2.5 rounded-lg text-xs hover:bg-emerald-500 disabled:opacity-50"
                >
                  {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}