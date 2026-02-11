"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-full max-w-xs">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onRemove }: { toast: Toast; onRemove: (id: number) => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 5000); // Hilang dalam 5 detik
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const styles = {
    success: "border-emerald-500/50 bg-emerald-950/90 text-emerald-400",
    error: "border-rose-500/50 bg-rose-950/90 text-rose-400",
    info: "border-blue-500/50 bg-slate-900/90 text-blue-400"
  };

  const icons = {
    success: <CheckCircle2 size={18} />,
    error: <AlertCircle size={18} />,
    info: <Info size={18} />
  };

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl animate-in slide-in-from-right-10 fade-in duration-300 ${styles[toast.type]}`}>
      <div className="mt-0.5">{icons[toast.type]}</div>
      <p className="text-xs font-medium flex-1 leading-relaxed">{toast.message}</p>
      <button onClick={() => onRemove(toast.id)} className="text-white/20 hover:text-white transition-colors">
        <X size={16} />
      </button>
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};