import React from "react";
import { ClipboardList, Plus, Save, Send, Trash2 } from "lucide-react";
import { formatCurrency, rowId } from "../../utils/format.js";
import { EmptyState, Field, PanelHeader } from "../ui/index.js";

export function TransactionTab({
  transactions,
  employees,
  moduleOptions,
  transactionForm,
  setTransactionForm,
  saving,
  onSave,
  onSubmitApproval,
  onDelete,
}) {
  return (
    <div className="two-column narrow-left">
      <section className="panel">
        <PanelHeader
          icon={Plus}
          title="Tambah Transaksi"
          subtitle="Setelah transaksi dibuat, ajukan approval untuk menjalankan stored procedure."
        />
        <form className="form-grid single" onSubmit={onSave}>
          <Field label="Modul">
            <select
              value={transactionForm.Modul_id}
              onChange={(event) => setTransactionForm((current) => ({ ...current, Modul_id: event.target.value }))}
              required
            >
              {moduleOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id} - {item.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Amount">
            <input
              type="number"
              min="0"
              value={transactionForm.Amount}
              onChange={(event) => setTransactionForm((current) => ({ ...current, Amount: event.target.value }))}
              required
            />
          </Field>
          <Field label="Created By">
            <select
              value={transactionForm.createdBy}
              onChange={(event) => setTransactionForm((current) => ({ ...current, createdBy: event.target.value }))}
              required
            >
              <option value="">Pilih pegawai</option>
              {employees.map((employee) => (
                <option key={employee.Nik} value={employee.Nik}>
                  {employee.Nik} - {employee.Name}
                </option>
              ))}
            </select>
          </Field>
          <div className="form-actions">
            <button className="primary-button" disabled={saving} type="submit">
              <Save size={17} />
              Simpan
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <PanelHeader icon={ClipboardList} title="Daftar Transaksi" subtitle="Tombol ajukan menjalankan dbo.SubmitNeedApproval." />
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Modul</th>
                <th>Amount</th>
                <th>Pembuat</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={rowId(transaction)}>
                  <td>#{rowId(transaction)}</td>
                  <td>
                    <strong>{transaction.Modul || "-"}</strong>
                    <span>ID {transaction.Modul_id}</span>
                  </td>
                  <td>{formatCurrency(transaction.Amount)}</td>
                  <td>
                    <strong>{transaction.createdByName || transaction.createdBy}</strong>
                    <span>{transaction.createdBy}</span>
                  </td>
                  <td className="row-actions">
                    <button
                      className="icon-button"
                      onClick={() => onSubmitApproval(rowId(transaction))}
                      title="Ajukan approval"
                    >
                      <Send size={16} />
                    </button>
                    <button
                      className="icon-button danger"
                      onClick={() => onDelete("transaction", rowId(transaction))}
                      title="Hapus transaksi"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!transactions.length && <EmptyState>Belum ada transaksi.</EmptyState>}
        </div>
      </section>
    </div>
  );
}
