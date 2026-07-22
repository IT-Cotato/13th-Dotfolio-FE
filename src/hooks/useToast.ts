import { useRef, useState } from 'react';

interface ToastState {
  message: string;
  onUndo?: () => void;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fireToast = (message: string, onUndo?: () => void) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, onUndo });
    timerRef.current = setTimeout(() => setToast(null), 2000);
  };

  const dismissToast = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(null);
  };

  return { toast, fireToast, dismissToast };
}
