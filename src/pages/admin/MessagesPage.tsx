import { useState } from 'react';
import { Mail, Phone, Trash2, ChevronDown, Circle } from 'lucide-react';
import { useAdminMessages, useMarkMessageRead, useDeleteMessage } from '../../hooks/useMessages';
import AdminLayout from '../../components/admin/AdminLayout';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import type { DbMessage } from '../../types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminMessagesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminMessages(page);
  const markRead = useMarkMessageRead();
  const deleteMessage = useDeleteMessage();

  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const messages = data?.messages ?? [];
  const total = data?.total ?? 0;
  const pageSize = data?.pageSize ?? 20;
  const totalPages = Math.ceil(total / pageSize);

  function toggleExpand(m: DbMessage) {
    const opening = expanded !== m.id;
    setExpanded(opening ? m.id : null);
    if (opening && !m.read) {
      markRead.mutate({ id: m.id, read: true });
    }
  }

  async function handleDelete(id: string) {
    await deleteMessage.mutateAsync(id);
    setDeleteId(null);
    if (expanded === id) setExpanded(null);
  }

  return (
    <AdminLayout title="Messages">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {messages.length === 0 && (
            <div className="text-center py-16 text-sm text-gray-400">
              No messages yet. Submissions from the "Get in Touch" form will show up here.
            </div>
          )}

          {messages.map(m => {
            const isOpen = expanded === m.id;
            return (
              <div key={m.id} className="border-b border-gray-50 last:border-0">
                <button
                  type="button"
                  onClick={() => toggleExpand(m)}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {!m.read && (
                    <Circle size={8} fill="currentColor" className="text-indigo-600 shrink-0" aria-label="Unread" />
                  )}
                  <div className={`flex-1 min-w-0 ${m.read ? '' : 'font-semibold'}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-900 truncate">{m.name}</span>
                      <span className="text-xs text-gray-400 font-normal shrink-0">— {m.subject}</span>
                    </div>
                    <p className="text-xs text-gray-500 font-normal truncate mt-0.5">{m.message}</p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 hidden sm:block">{formatDate(m.created_at)}</span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 flex flex-col gap-4 bg-gray-50">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{m.message}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <a href={`mailto:${m.email}`} className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                        <Mail size={13} />
                        {m.email}
                      </a>
                      {m.phone && (
                        <a href={`tel:${m.phone}`} className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                          <Phone size={13} />
                          {m.phone}
                        </a>
                      )}
                      <span>{formatDate(m.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => markRead.mutate({ id: m.id, read: !m.read })}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        Mark as {m.read ? 'unread' : 'read'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(m.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer transition-colors"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                {total} messages — Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer disabled:opacity-40 transition-colors"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer disabled:opacity-40 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        message="Are you sure you want to delete this message? This cannot be undone."
        onConfirm={() => deleteId && handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
        loading={deleteMessage.isPending}
      />
    </AdminLayout>
  );
}
