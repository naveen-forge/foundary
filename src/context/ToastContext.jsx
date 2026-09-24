import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const showToast = useCallback((message, tone = 'ink') => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.tone}`}>
            {t.message}
          </div>
        ))}
      </div>
      <style>{`
        .toast-stack {
          position: fixed;
          bottom: 20px;
          right: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 999;
        }
        .toast {
          background: var(--ink);
          color: var(--paper);
          padding: 12px 18px;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          box-shadow: 0 10px 24px -10px rgba(0,0,0,0.4);
          max-width: 320px;
          animation: toast-in 0.18s ease-out;
        }
        .toast-teal { background: var(--teal-dark); }
        .toast-rust { background: var(--rust-dark); }
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 480px) {
          .toast-stack { left: 16px; right: 16px; }
          .toast { max-width: none; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
