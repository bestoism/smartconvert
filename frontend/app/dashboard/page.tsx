"use client";

import { useEffect, useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  Activity, 
  AlertCircle, 
  BarChart3, 
  Globe, 
  Table as TableIcon,
  PieChart as PieIcon,
  Loader2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell, CartesianGrid, PieChart, Pie, Legend
} from 'recharts';
import api from '@/lib/api';

// --- Palette Warna ---
const COLORS_PALE = ['#6366F1', '#8B5CF6', '#D946EF', '#06B6D4', '#10B981', '#F59E0B'];
const COLORS_STATUS = ['#F472B6', '#FB923C', '#2DD4BF', '#A855F7'];

// --- Komponen Custom Tooltip ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-2xl">
        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{label || payload[0].name}</p>
        <p className="text-sm font-bold text-white">
          Total: <span className="text-emerald-400">{payload[0].value.toLocaleString()}</span>
        </p>
      </div>
    );
  }
  return null;
};

// --- Komponen Stat Card ---
function StatCard({ label, value, icon: Icon, colorClass, help }: any) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-all group">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg bg-opacity-10 transition-colors ${colorClass.replace('text-', 'bg-')}`}>
          <Icon className={colorClass} size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{value?.toLocaleString() || 0}</h3>
          {help && <p className="text-[10px] text-slate-500 mt-1 font-light italic">{help}</p>}
        </div>
      </div>
    </div>
  );
}

// --- Komponen Flippable Chart Card ---
function FlippableCard({ title, icon: Icon, description, children, dataView, isFlipped, onToggle, colorClass }: any) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl relative group transition-all duration-300">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h4 className="text-white font-bold text-sm mb-1 flex items-center gap-2">
            <Icon size={16} className={colorClass}/> {title}
          </h4>
          <p className="text-xs text-slate-500 font-light">{description}</p>
        </div>
        <button 
          onClick={onToggle}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-emerald-400 transition-all"
        >
          {isFlipped ? <BarChart3 size={16} /> : <TableIcon size={16} />}
        </button>
      </div>

      <div className="h-[300px] w-full flex items-center justify-center">
        {!isFlipped ? (
          <div className="w-full h-full animate-in fade-in duration-500">
            {children}
          </div>
        ) : (
          <div className="w-full h-full overflow-y-auto animate-in zoom-in-95 duration-300 pr-2 custom-scrollbar">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-slate-900 shadow-sm">
                <tr className="border-b border-slate-800">
                  <th className="py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Kategori</th>
                  <th className="py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {dataView?.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="py-3 text-xs text-slate-300 capitalize">{item.name || item.job}</td>
                    <td className="py-3 text-xs font-mono font-bold text-emerald-400 text-right">{item.value?.toLocaleString() || item.count?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [flipped, setFlipped] = useState<any>({
    score: false,
    job: false,
    age: false,
    edu: false,
    marital: false
  });

  const toggleFlip = (key: string) => {
    setFlipped((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error("Gagal fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="animate-spin text-emerald-500" size={40} />
      <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Synchronizing Engine...</p>
    </div>
  );

  return (
    // PERBAIKAN: Tambahkan pt-24 di mobile (base) agar tidak tertimpa Navbar (h-16)
    // Gunakan lg:pt-0 karena di desktop sidebar berada di samping, bukan di atas.
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 pt-15 lg:pt-0">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Executive Dashboard</h1>
          <p className="text-slate-500 font-light mt-1 text-xs md:text-sm">
            Operational Intelligence Engine <span className="text-emerald-500/50 font-mono italic">v2.0.4-stable</span>
          </p>
        </div>
        <div className="hidden md:block text-right">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Security Status</p>
            <p className="text-xs text-emerald-500 font-bold flex items-center gap-2 justify-end">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Live Production
            </p>
        </div>
      </div>

      {/* 1. KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Leads" value={stats?.total_leads} icon={Users} colorClass="text-blue-400" />
        <StatCard label="High Potential" value={stats?.high_potential} help="Ready to call" icon={TrendingUp} colorClass="text-emerald-400" />
        <StatCard label="Medium Potential" value={stats?.medium_potential} icon={Activity} colorClass="text-yellow-400" />
        <StatCard label="Low Potential" value={stats?.low_potential} help="Lowest priority" icon={AlertCircle} colorClass="text-rose-400" />
      </div>

      {/* 2. MAIN ANALYTICS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <FlippableCard 
          title="AI Confidence Score"
          icon={TrendingUp}
          colorClass="text-emerald-500"
          description="Probability distribution for the entire population."
          isFlipped={flipped.score}
          onToggle={() => toggleFlip('score')}
          dataView={stats?.score_dist}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.score_dist || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} dy={10} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{fill: '#ffffff', opacity: 0.05}} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                {(stats?.score_dist || []).map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={index >= 3 ? '#10b981' : '#3b82f6'} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </FlippableCard>

        <FlippableCard 
          title="Job Distribution"
          icon={BarChart3}
          colorClass="text-blue-500"
          description="Top performing professional categories."
          isFlipped={flipped.job}
          onToggle={() => toggleFlip('job')}
          dataView={stats?.job_dist}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.job_dist || []} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} width={100} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: '#ffffff', opacity: 0.05}} />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={12} fillOpacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </FlippableCard>
      </div>

      {/* 3. DEMOGRAPHICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FlippableCard 
          title="Age Groups"
          icon={Users}
          colorClass="text-amber-500"
          description="Population by age bracket."
          isFlipped={flipped.age}
          onToggle={() => toggleFlip('age')}
          dataView={stats?.age_dist}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.age_dist || []}>
              <XAxis dataKey="name" tick={{fontSize: 9, fill:'#64748b'}} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#F59E0B" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </FlippableCard>

        <FlippableCard 
          title="Education"
          icon={PieIcon}
          colorClass="text-purple-500"
          description="Lead count by education level."
          isFlipped={flipped.edu}
          onToggle={() => toggleFlip('edu')}
          dataView={stats?.edu_dist}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={stats?.edu_dist || []} dataKey="value" innerRadius={50} outerRadius={70} paddingAngle={5}>
                {(stats?.edu_dist || []).map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS_PALE[index % COLORS_PALE.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{fontSize: '10px', paddingTop: '10px'}} />
            </PieChart>
          </ResponsiveContainer>
        </FlippableCard>

        <FlippableCard 
          title="Marital Status"
          icon={Activity}
          colorClass="text-pink-500"
          description="Lead distribution by status."
          isFlipped={flipped.marital}
          onToggle={() => toggleFlip('marital')}
          dataView={stats?.marital_dist}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={stats?.marital_dist || []} dataKey="value" innerRadius={50} outerRadius={70} paddingAngle={5}>
                {(stats?.marital_dist || []).map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS_STATUS[index % COLORS_STATUS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{fontSize: '10px', paddingTop: '10px'}} />
            </PieChart>
          </ResponsiveContainer>
        </FlippableCard>
      </div>

      {/* 4. ECONOMIC CONTEXT SUMMARY */}
      <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl border-t-4 border-t-orange-500 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h4 className="text-white font-bold text-sm flex items-center gap-2">
              <Globe size={16} className="text-orange-500"/> Economic Climate Context
            </h4>
            <p className="text-xs text-slate-500 font-light mt-1 text-[11px]">Euribor 3M Interest Rate distribution in current batch.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
            {stats?.econ_dist?.map((item: any) => (
              <div key={item.name} className="animate-in fade-in duration-1000">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{item.name}</p>
                <p className="text-xl md:text-2xl font-bold text-orange-400">{item.value.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="flex justify-center pt-10 border-t border-slate-900">
        <p className="text-[9px] md:text-[10px] text-slate-600 uppercase tracking-[0.2em] font-bold text-center">
          © 2026 Data Infrastructure Analytics • Enterprise Deployment Mode
        </p>
      </div>
    </div>
  );
}