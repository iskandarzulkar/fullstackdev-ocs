import React from "react";
import { Edit3, Save, Trash2, UserRound } from "lucide-react";
import { emptyEmployee } from "../../constants/forms.js";
import { EmptyState, Field, PanelHeader } from "../ui/index.js";

export function EmployeeTab({
  employees,
  employeeForm,
  setEmployeeForm,
  editingEmployeeNik,
  setEditingEmployeeNik,
  saving,
  onSave,
  onEdit,
  onDelete,
}) {
  return (
    <div className="two-column">
      <section className="panel">
        <PanelHeader
          icon={UserRound}
          title={editingEmployeeNik ? "Edit Pegawai" : "Tambah Pegawai"}
          subtitle="Data pegawai dipakai untuk validasi NIK dan sumber approver HRIS."
        />
        <form className="form-grid" onSubmit={onSave}>
          <Field label="NIK">
            <input
              value={employeeForm.Nik}
              onChange={(event) => setEmployeeForm((current) => ({ ...current, Nik: event.target.value }))}
              disabled={Boolean(editingEmployeeNik)}
              required
            />
          </Field>
          <Field label="Nama">
            <input
              value={employeeForm.Name}
              onChange={(event) => setEmployeeForm((current) => ({ ...current, Name: event.target.value }))}
              required
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={employeeForm.Email}
              onChange={(event) => setEmployeeForm((current) => ({ ...current, Email: event.target.value }))}
              required
            />
          </Field>
          <Field label="Jabatan">
            <input
              value={employeeForm.Position}
              onChange={(event) => setEmployeeForm((current) => ({ ...current, Position: event.target.value }))}
              required
            />
          </Field>
          <Field label="Approver 1">
            <input
              value={employeeForm.Approver1_name}
              onChange={(event) => setEmployeeForm((current) => ({ ...current, Approver1_name: event.target.value }))}
              placeholder="Nama atasan pertama"
            />
          </Field>
          <Field label="Email Approver 1">
            <input
              type="email"
              value={employeeForm.Approver1_email}
              onChange={(event) => setEmployeeForm((current) => ({ ...current, Approver1_email: event.target.value }))}
            />
          </Field>
          <Field label="Jabatan Approver 1">
            <input
              value={employeeForm.Approver1_position}
              onChange={(event) =>
                setEmployeeForm((current) => ({ ...current, Approver1_position: event.target.value }))
              }
            />
          </Field>
          <Field label="Approver 2">
            <input
              value={employeeForm.Approver2_name}
              onChange={(event) => setEmployeeForm((current) => ({ ...current, Approver2_name: event.target.value }))}
              placeholder="Nama atasan kedua"
            />
          </Field>
          <Field label="Email Approver 2">
            <input
              type="email"
              value={employeeForm.Approver2_email}
              onChange={(event) => setEmployeeForm((current) => ({ ...current, Approver2_email: event.target.value }))}
            />
          </Field>
          <Field label="Jabatan Approver 2">
            <input
              value={employeeForm.Approver2_position}
              onChange={(event) =>
                setEmployeeForm((current) => ({ ...current, Approver2_position: event.target.value }))
              }
            />
          </Field>
          <div className="form-actions">
            <button className="primary-button" disabled={saving} type="submit">
              <Save size={17} />
              Simpan
            </button>
            <button
              className="secondary-button"
              type="button"
              onClick={() => {
                setEmployeeForm(emptyEmployee);
                setEditingEmployeeNik("");
              }}
            >
              Batal
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <PanelHeader icon={UserRound} title="Daftar Pegawai" subtitle="Klik edit untuk mengubah data pegawai." />
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>NIK</th>
                <th>Pegawai</th>
                <th>Approver HRIS</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.Nik}>
                  <td>{employee.Nik}</td>
                  <td>
                    <strong>{employee.Name}</strong>
                    <span>{employee.Email}</span>
                    <small>{employee.Position}</small>
                  </td>
                  <td>
                    <strong>{employee.Approver1_name || "-"}</strong>
                    <span>{employee.Approver2_name || ""}</span>
                  </td>
                  <td className="row-actions">
                    <button className="icon-button" onClick={() => onEdit(employee)} title="Edit pegawai">
                      <Edit3 size={16} />
                    </button>
                    <button
                      className="icon-button danger"
                      onClick={() => onDelete("employee", employee.Nik)}
                      title="Hapus pegawai"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!employees.length && <EmptyState>Belum ada data pegawai.</EmptyState>}
        </div>
      </section>
    </div>
  );
}
