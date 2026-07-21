import React from "react";
import { Loader2, RefreshCcw } from "lucide-react";

export function Topbar({ loading, onRefresh }) {
  return (
    <header className="topbar">
      <div>
        <h1>Sistem Approval Dinamis</h1>
        <p>Kelola pegawai, aturan approval, transaksi, dan hasil NeedApproval.</p>
      </div>
      <button className="icon-button" onClick={onRefresh} disabled={loading} title="Muat ulang data" type="button">
        {loading ? <Loader2 className="spin" size={18} /> : <RefreshCcw size={18} />}
      </button>
    </header>
  );
}
