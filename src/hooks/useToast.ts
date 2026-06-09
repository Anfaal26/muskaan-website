import { create } from 'zustand';
import type { Toast, ToastVariant } from '../types';

interface ToastState {
  toasts: Toast[];
  show: (message: string, variant?: ToastVariant) => void;
  dismiss: (id: string) => void;
}

let counter = 0;

export const useToast = create<ToastState>((set) => ({
  toasts: [],

  show: (message, variant = 'info') => {
    const id = String(++counter);
    set(state => ({ toasts: [...state.toasts, { id, message, variant }] }));
    setTimeout(() => {
      set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
    }, 3500);
  },

  dismiss: (id) => {
    set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
  },
}));
