import React from "react";

export function Notice({ notice, onClose }) {
  if (!notice.message) return null;

  return (
    <div className={`notice ${notice.type}`}>
      <span>{notice.message}</span>
      <button type="button" onClick={onClose} title="Tutup pesan">
        x
      </button>
    </div>
  );
}
