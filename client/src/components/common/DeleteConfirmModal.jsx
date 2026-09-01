import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Trash2, X, Loader2 } from 'lucide-react';

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Item',
  itemName,
  description,
  loading = false,
  confirmText = 'Delete',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
      }}
    >
      <div
        className="bg-white w-full max-w-sm rounded-3xl p-6 sm:p-7 shadow-2xl border border-zinc-200 space-y-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header: Trash Icon + Title on Left, Close Button on Right (Single Row) */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-2xs shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-zinc-900 font-display tracking-tight truncate">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Description */}
        <p className="text-xs text-zinc-500 font-medium leading-relaxed">
          {description || (
            <>
              Are you sure you want to permanently delete{' '}
              {itemName ? <strong className="text-zinc-900 font-bold">"{itemName}"</strong> : 'this item'}? This
              action cannot be undone.
            </>
          )}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
