import React from 'react';

export default function ConfirmDialog({ open, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-lg w-72">
        <p className="mb-4 text-sm text-center">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 rounded bg-red-600 text-white"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
