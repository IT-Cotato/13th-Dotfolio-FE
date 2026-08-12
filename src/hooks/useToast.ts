import { useCallback, useRef, useState } from 'react';

interface ToastState {
  message: string;
  onUndo?: () => void;
  variant?: 'success' | 'error';
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fireToast = useCallback((message: string, onUndo?: () => void, variant: 'success' | 'error' = 'success') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, onUndo, variant });
    timerRef.current = setTimeout(() => setToast(null), 2000);
  }, []);

  const dismissToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(null);
  }, []);

  return { toast, fireToast, dismissToast };
}
