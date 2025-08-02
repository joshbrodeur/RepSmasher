import React, { useState, useEffect } from 'react';

export default function SaveWorkoutModal({ open, initialName = '', onSave, onCancel }) {
  const [value, setValue] = useState(initialName);

  useEffect(() => {
    if (open) setValue(initialName);
  }, [open, initialName]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-lg w-80 space-y-4">
        <h2 className="text-lg font-bold text-center">Save Workout</h2>
        <input
          className="w-full p-2 rounded border dark:bg-gray-700"
          placeholder="Workout name"
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 rounded bg-green-600 text-white"
            onClick={() => onSave(value.trim())}
            disabled={!value.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
