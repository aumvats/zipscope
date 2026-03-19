'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const borderColor = {
    success: 'border-l-success',
    error: 'border-l-error',
    info: 'border-l-primary',
  }[toast.type];

  return (
    <div
      className={`bg-surface border border-border border-l-4 ${borderColor} rounded-md shadow-lg px-4 py-3 text-sm text-text-primary max-w-sm animate-slide-in`}
    >
      <div className="flex justify-between items-start gap-3">
        <span>{toast.message}</span>
        <button
          onClick={() => onDismiss(toast.id)}
          className="text-text-secondary hover:text-text-primary text-lg leading-none transition-colors duration-fast"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
