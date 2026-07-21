import React from "react";
import { Edit3, Layers3, Save, Trash2 } from "lucide-react";
import { emptyModule } from "../../constants/forms.js";
import { EmptyState, Field, PanelHeader } from "../ui/index.js";

export function ModuleTab({
  modules,
  moduleForm,
  setModuleForm,
  editingModuleId,
  setEditingModuleId,
  saving,
  onSave,
  onEdit,
  onDelete,
}) {
  return (
    <div className="two-column narrow-left">
      <section className="panel">
        <PanelHeader
          icon={Layers3}
          title={editingModuleId ? "Edit Modul" : "Tambah Modul"}
          subtitle="Master modul menjadi sumber resmi Modul_id dan nama modul."
        />
        <form className="form-grid single" onSubmit={onSave}>
          <Field label="Modul ID">
            <input
              type="number"
              min="1"
              value={moduleForm.id}
              onChange={(event) => setModuleForm((current) => ({ ...current, id: event.target.value }))}
              disabled={Boolean(editingModuleId)}
              required
            />
          </Field>
          <Field label="Nama Modul">
            <input
              value={moduleForm.Name}
              onChange={(event) => setModuleForm((current) => ({ ...current, Name: event.target.value }))}
              placeholder="Transaction"
              required
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
                setModuleForm(emptyModule);
                setEditingModuleId("");
              }}
            >
              Batal
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <PanelHeader icon={Layers3} title="Daftar Modul" subtitle="Nama modul dibuat unik agar Modul_id tidak ambigu." />
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Modul ID</th>
                <th>Nama Modul</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {modules.map((moduleItem) => (
                <tr key={moduleItem.id}>
                  <td>{moduleItem.id}</td>
                  <td>
                    <strong>{moduleItem.Name}</strong>
                  </td>
                  <td className="row-actions">
                    <button className="icon-button" onClick={() => onEdit(moduleItem)} title="Edit modul">
                      <Edit3 size={16} />
                    </button>
                    <button
                      className="icon-button danger"
                      onClick={() => onDelete("module", moduleItem.id)}
                      title="Hapus modul"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!modules.length && <EmptyState>Belum ada data modul.</EmptyState>}
        </div>
      </section>
    </div>
  );
}
