import React from "react";
import { FileCheck2, Trash2 } from "lucide-react";
import { rowId } from "../../utils/format.js";
import { EmptyState, PanelHeader } from "../ui/index.js";

export function NeedApprovalTab({
  approvals,
  moduleNameById,
  transactionFilter,
  totalApprovals,
  onClearTransactionFilter,
  onDelete,
}) {
  return (
    <section className="panel">
      <PanelHeader
        icon={FileCheck2}
        title="Need Approval"
        subtitle={
          transactionFilter
            ? `Menampilkan hasil approval untuk transaksi #${transactionFilter}.`
            : "Hasil akhir rule approval setelah transaksi diajukan."
        }
        action={
          transactionFilter ? (
            <button className="secondary-button" type="button" onClick={onClearTransactionFilter}>
              Tampilkan semua
            </button>
          ) : null
        }
      />
      {transactionFilter && (
        <div className="filter-note">
          <strong>Filter aktif:</strong>
          <span>
            Transaksi #{transactionFilter}. Total seluruh Need Approval tersimpan: {totalApprovals}.
          </span>
        </div>
      )}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Transaksi</th>
              <th>Modul</th>
              <th>Approver</th>
              <th>Email</th>
              <th>Jabatan</th>
              <th>Level</th>
              <th>Sumber</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {approvals.map((approval) => (
              <tr key={rowId(approval)}>
                <td>#{approval.Transaction_Id}</td>
                <td>
                  <strong>{moduleNameById[String(approval.Modul_id)] || "-"}</strong>
                  <span>ID {approval.Modul_id}</span>
                </td>
                <td>
                  <strong>{approval.Name}</strong>
                  <span>{approval.Nik || "-"}</span>
                </td>
                <td>{approval.Email}</td>
                <td>{approval.Position || "-"}</td>
                <td>{approval.Level}</td>
                <td>{approval.SourceType || "Manual"}</td>
                <td className="row-actions">
                  <button
                    className="icon-button danger"
                    onClick={() => onDelete("approval", rowId(approval))}
                    title="Hapus need approval"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!approvals.length && (
          <EmptyState>
            {transactionFilter
              ? `Belum ada Need Approval untuk transaksi #${transactionFilter}.`
              : "Belum ada Need Approval."}
          </EmptyState>
        )}
      </div>
    </section>
  );
}
