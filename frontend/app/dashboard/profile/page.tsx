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
  ChevronRight, 
  Loader2,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useToast } from '@/components/Toast';

export default function ProfilePage() {
  const { showToast } = useToast();
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
      showToast("Koneksi terputus: Gagal memuat identitas pengguna.", "error");
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
      showToast("Data profil telah berhasil disinkronkan dengan server.", "success");
      setIsModalOpen(false);
    } catch (err) {
      showToast("Sinkronisasi Gagal: Periksa data input Anda.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="animate-spin text-emerald-500" size={32} />
      <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest text-center px-6">Initializing Secure Identity...</p>
    </div>
  );

  if (!profile) return null;

  return (
    // PERBAIKAN: pt-24 di mobile agar tidak tertimpa navbar h-16. px-4 agar tidak mepet layar.
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 pt-15 lg:pt-0 px-4 md:px-0 text-slate-100">
      
      {/* HEADER SECTION - Responsive Flex */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">My Profile</h1>
          <p className="text-slate-500 text-xs md:text-sm font-light mt-1 tracking-tight underline decoration-emerald-500/20 underline-offset-4">
            Sistem Manajemen Identitas Sales <span className="font-mono text-[10px] ml-1">v2.0.4</span>
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold border border-slate-700 transition-all shadow-sm active:scale-95"
        >
          <Edit3 size={14} /> Update Credentials
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM 1: KARTU IDENTITAS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 h-fit shadow-xl relative overflow-hidden">
          {/* Aksen visual background */}
          <div className="absolute top-0 right-0 p-4 opacity-5">
             <ShieldCheck size={100} className="text-emerald-500" />
          </div>

          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-950/20 rotate-3 transition-transform hover:rotate-0 duration-500">
              <span className="text-3xl md:text-4xl font-bold text-slate-950 -rotate-3">{profile.name.charAt(0)}</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">{profile.name}</h2>
            <p className="text-xs text-emerald-500 font-bold mt-1 uppercase tracking-widest">{profile.role}</p>
          </div>

          <div className="mt-10 space-y-6 relative z-10">
            <div className="space-y-1.5">
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em]">Employee ID</p>
              <div className="flex items-center gap-3 text-slate-300">
                <Award size={16} className="text-emerald-500 shrink-0" />
                <span className="text-sm font-mono">{profile.id_emp}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em]">Corporate Email</p>
              <div className="flex items-center gap-3 text-slate-300">
                <Mail size={16} className="text-emerald-500 shrink-0" />
                <span className="text-sm truncate">{profile.email}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em]">Join Date</p>
              <div className="flex items-center gap-3 text-slate-300">
                <Calendar size={16} className="text-emerald-500 shrink-0" />
                <span className="text-sm">{profile.joined_date}</span>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM 2 & 3: STATS & LOGS */}
        <div className="lg:col-span-2 space-y-8">
          {/* STATS GRID - 2 kolom di mobile kecil, 3 di tablet */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <StatBox icon={BarChart3} label="Records" value={profile.stats.leads_processed} colorClass="text-blue-400" />
            <StatBox icon={TrendingUp} label="Accuracy" value={`${profile.stats.conversion_rate}%`} colorClass="text-emerald-400" />
            <div className="col-span-2 md:col-span-1">
               <StatBox icon={Clock} label="Active" value={`${profile.active_days} Days`} colorClass="text-orange-400" />
            </div>
          </div>

          {/* TARGET CARD */}
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl shadow-lg border-l-4 border-l-rose-600">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Target className="text-rose-500" size={20} />
                <h4 className="text-xs md:text-sm font-bold text-white uppercase tracking-widest">Monthly Goal</h4>
              </div>
              <span className="text-xs md:text-sm font-black text-rose-500 font-mono">
                {profile.stats.current_progress} / {profile.monthly_target}
              </span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-rose-500 transition-all duration-1000 shadow-[0_0_10px_rgba(225,29,72,0.4)]"
                style={{ width: `${Math.min((profile.stats.current_progress / profile.monthly_target) * 100, 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-600 font-light italic">Target akumulasi nasabah berstatus 'Interested'.</p>
          </div>

          {/* LIVE ACTIVITY LOGS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 bg-slate-950/30 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Activity Stream</h4>
               </div>
            </div>
            <div className="divide-y divide-slate-800/50">
              {profile.recent_activities.length === 0 ? (
                <div className="p-10 text-center text-slate-600 text-xs italic">No activity detected.</div>
              ) : (
                profile.recent_activities.map((act: any, i: number) => (
                  <div key={i} className="p-4 hover:bg-white/[0.01] transition-all flex items-center justify-between group">
                    <div className="flex gap-4 items-center min-w-0">
                      <div className="h-1 w-1 rounded-full bg-emerald-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-slate-200 font-medium tracking-tight truncate">{act.content}</p>
                        <p className="text-[9px] text-slate-600 font-mono mt-0.5">{act.time}</p>
                      </div>
                    </div>
                    <Link href={`/dashboard/leads/${act.lead_id}`} className="p-2 text-slate-700 hover:text-emerald-500 transition-colors">
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- CUSTOM MODAL (Responsive) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-slate-800">
              <h3 className="text-md font-bold text-white">Update Identity</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-600 hover:text-white transition-colors"><X size={20}/></button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1">Full Name</label>
                <input 
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-emerald-500 transition-all"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1">Professional Role</label>
                <input 
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-emerald-500 transition-all"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1">Monthly Target</label>
                <input 
                  required
                  type="number"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-emerald-500 transition-all font-mono"
                  value={formData.monthly_target || ''}
                  onChange={(e) => setFormData({...formData, monthly_target: parseInt(e.target.value)})}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-800 text-white font-bold py-3 rounded-xl text-xs hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl text-xs hover:bg-emerald-500 disabled:opacity-50 transition-all shadow-lg shadow-emerald-900/20"
                >
                  {isSaving ? "Syncing..." : "Apply Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ icon: Icon, label, value, colorClass }: any) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-4 md:p-6 rounded-xl shadow-md border-t-2 border-t-slate-800 hover:border-t-emerald-500 transition-all group">
      <div className="flex items-center gap-3 mb-2">
        <Icon size={14} className={`${colorClass} group-hover:scale-110 transition-transform`} />
        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xl md:text-2xl font-bold text-white tracking-tight">{value}</p>
    </div>
  );
}