import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from './useProducts';
import type { DbMessage } from '../types';

export function useAdminMessages(page = 1) {
  return useQuery<{ messages: DbMessage[]; total: number; unread: number; page: number; pageSize: number }>({
    queryKey: ['admin', 'messages', page],
    queryFn: () => apiFetch(`/api/admin/messages?page=${page}`),
  });
}

export function useMarkMessageRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, read }: { id: string; read: boolean }) =>
      apiFetch(`/api/admin/messages/${id}`, { method: 'PATCH', body: JSON.stringify({ read }) }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'messages'] });
    },
  });
}

export function useDeleteMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch(`/api/admin/messages/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'messages'] });
    },
  });
}
