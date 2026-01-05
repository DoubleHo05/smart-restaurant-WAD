import { createContext, useContext, useState, type ReactNode } from "react";
import ToastContainer from "../components/ToastContainer";
import { type ToastType } from "../components/Toast";
interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}
interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}
const ToastContext = createContext<ToastContextType | undefined>(undefined);
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const showToast = (message: string, type: ToastType, duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };
  const success = (message: string) => showToast(message, "success");
  const error = (message: string) => showToast(message, "error");
  const warning = (message: string) => showToast(message, "warning");
  const info = (message: string) => showToast(message, "info");
  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <ToastContainer
        toasts={toasts.map((t) => ({ ...t, onClose: () => removeToast(t.id) }))}
        onRemove={removeToast}
      />
    </ToastContext.Provider>
  );
}
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
