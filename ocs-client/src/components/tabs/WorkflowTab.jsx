import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, CircleSlash, Edit3, PlayCircle, Save, Trash2, Workflow } from "lucide-react";
import { approvalTypes, emptyWorkflow } from "../../constants/forms.js";
import { formatCurrency, rowId } from "../../utils/format.js";
import { EmptyState, Field, PanelHeader } from "../ui/index.js";

function isAmountRuleMatched(type, amount, value) {
  const numericAmount = Number(amount || 0);
  const numericValue = Number(value || 0);

  if (type === "Total Amount >=") return numericAmount >= numericValue;
  if (type === "Total Amount >") return numericAmount > numericValue;
  if (type === "Total Amount <=") return numericAmount <= numericValue;
  if (type === "Total Amount <") return numericAmount < numericValue;

  return false;
}

function sourceLabel(source) {
  if (source === "HRIS") return "HRIS";
  if (source === "Custom") return "Custom";
  return source || "Manual";
}

function procedureTypeOrder(type) {
  if (type === "Custom") return 1;
  if (type?.startsWith("Total Amount")) return 2;
  if (type === "HRIS") return 3;
  return 4;
}

function compareWorkflowByProcedure(a, b) {
  const moduleOrder = Number(a.Modul_id || 0) - Number(b.Modul_id || 0);
  if (moduleOrder !== 0) return moduleOrder;

  const levelOrder = Number(a.Level || 0) - Number(b.Level || 0);
  if (levelOrder !== 0) return levelOrder;

  const typeOrder = procedureTypeOrder(a.Type) - procedureTypeOrder(b.Type);
  if (typeOrder !== 0) return typeOrder;

  return String(a.Name || "HRIS").localeCompare(String(b.Name || "HRIS"));
}

function workflowValueLabel(workflow) {
  if (workflow.Type === "Custom") return "-";
  if (workflow.Type === "HRIS") return "Tidak dipakai procedure";
  return formatCurrency(workflow.Value);
}

function workflowApproverLabel(workflow) {
  if (workflow.Type === "HRIS") {
    return {
      title: "Approver HRIS pegawai pembuat",
      subtitle: "Diambil dari Approver 1 dan Approver 2 pada data pegawai.",
    };
  }

  return {
    title: workflow.Name || "-",
    subtitle: workflow.Email || "-",
  };
}

function workflowLevelLabel(workflow) {
  if (workflow.Type === "HRIS") {
    const baseLevel = Number(workflow.Level || 1);
    return `${baseLevel} dan ${baseLevel + 1}`;
  }

  return workflow.Level;
}

function buildSimulation({ workflows, employees, moduleId, amount, requesterNik }) {
  const requester = employees.find((employee) => String(employee.Nik) === String(requesterNik));
  const candidateApprovals = [];
  const ruleResults = [];

  workflows
    .filter((workflow) => String(workflow.Modul_id) === String(moduleId))
    .forEach((workflow) => {
      const type = workflow.Type || "";

      if (type === "Custom") {
        const matched = Boolean(workflow.Nik);
        ruleResults.push({
          id: rowId(workflow),
          type,
          matched,
          level: workflow.Level,
          detail: matched ? "Approver tetap dari rule custom." : "NIK approver belum dipilih.",
        });

        if (matched) {
          candidateApprovals.push({
            Nik: workflow.Nik,
            Name: workflow.Name,
            Email: workflow.Email,
            Position: workflow.Position,
            Level: Number(workflow.Level || 1),
            SourceType: "Custom",
          });
        }
        return;
      }

      if (type === "HRIS") {
        const hrisApprovers = requester
          ? [requester.Approver1_email, requester.Approver2_email]
              .map((email, index) => {
                const employee = employees.find((item) => item.Email === email);
                return employee ? { ...employee, SequenceNo: index + 1 } : null;
              })
              .filter(Boolean)
          : [];

        ruleResults.push({
          id: rowId(workflow),
          type,
          matched: hrisApprovers.length > 0,
          level: workflow.Level,
          detail: requester
            ? `${hrisApprovers.length} approver dari struktur pegawai ${requester.Name}.`
            : "Pilih pegawai pembuat transaksi.",
        });

        hrisApprovers.forEach((approver) => {
          candidateApprovals.push({
            Nik: approver.Nik,
            Name: approver.Name,
            Email: approver.Email,
            Position: approver.Position,
            Level: Number(workflow.Level || 1) + approver.SequenceNo - 1,
            SourceType: "HRIS",
          });
        });
        return;
      }

      if (type.startsWith("Total Amount")) {
        const matched = Boolean(workflow.Nik) && isAmountRuleMatched(type, amount, workflow.Value);
        ruleResults.push({
          id: rowId(workflow),
          type,
          matched,
          level: workflow.Level,
          detail: `${formatCurrency(amount)} ${matched ? "memenuhi" : "tidak memenuhi"} ${type} ${formatCurrency(
            workflow.Value,
          )}.`,
        });

        if (matched) {
          candidateApprovals.push({
            Nik: workflow.Nik,
            Name: workflow.Name,
            Email: workflow.Email,
            Position: workflow.Position,
            Level: Number(workflow.Level || 1),
            SourceType: type,
          });
        }
      }
    });

  const approvals = Object.values(
    candidateApprovals.reduce((total, approval) => {
      const key = approval.Nik;
      const current = total[key];

      if (!current) {
        total[key] = {
          ...approval,
          SourceType: [approval.SourceType],
        };
        return total;
      }

      current.Level = Math.min(Number(current.Level || 1), Number(approval.Level || 1));
      if (!current.SourceType.includes(approval.SourceType)) current.SourceType.push(approval.SourceType);
      return total;
    }, {}),
  ).sort((a, b) => {
    const level = Number(a.Level || 0) - Number(b.Level || 0);
    if (level !== 0) return level;
    return String(a.Name || "").localeCompare(String(b.Name || ""));
  });

  const levels = approvals.reduce((total, approval) => {
    const key = String(approval.Level || 1);
    total[key] = total[key] || [];
    total[key].push(approval);
    return total;
  }, {});

  return {
    requester,
    approvals,
    levels: Object.entries(levels),
    ruleResults,
  };
}

function WorkflowSimulation({ workflows, employees, moduleOptions }) {
  const [moduleId, setModuleId] = useState("");
  const [amount, setAmount] = useState(7500000);
  const [requesterNik, setRequesterNik] = useState("");

  useEffect(() => {
    if (!moduleId && moduleOptions.length) setModuleId(String(moduleOptions[0].id));
  }, [moduleId, moduleOptions]);

  useEffect(() => {
    if (!requesterNik && employees.length) setRequesterNik(String(employees[0].Nik));
  }, [employees, requesterNik]);

  const simulation = useMemo(
    () => buildSimulation({ workflows, employees, moduleId, amount, requesterNik }),
    [workflows, employees, moduleId, amount, requesterNik],
  );

  return (
    <section className="panel workflow-simulator">
      <PanelHeader
        icon={PlayCircle}
        title="Simulasi Workflow"
        subtitle="Coba contoh transaksi untuk melihat approver yang akan terbentuk sebelum transaksi diajukan."
      />

      <div className="simulation-controls">
        <Field label="Modul">
          <select value={moduleId} onChange={(event) => setModuleId(event.target.value)}>
            {moduleOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id} - {item.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Nominal transaksi">
          <input type="number" min="0" value={amount} onChange={(event) => setAmount(event.target.value)} />
        </Field>
        <Field label="Dibuat oleh">
          <select value={requesterNik} onChange={(event) => setRequesterNik(event.target.value)}>
            <option value="">Pilih pegawai</option>
            {employees.map((employee) => (
              <option key={employee.Nik} value={employee.Nik}>
                {employee.Nik} - {employee.Name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="simulation-flow" aria-label="Alur approval hasil simulasi">
        <div className="simulation-node requester-node">
          <span>Pengaju</span>
          <strong>{simulation.requester?.Name || "Belum dipilih"}</strong>
          <small>{simulation.requester?.Position || "Pilih pegawai pembuat"}</small>
        </div>

        {simulation.levels.map(([level, approvals]) => (
          <React.Fragment key={level}>
            <ArrowRight className="flow-icon" size={20} />
            <div className="simulation-level">
              <div className="level-title">Level {level}</div>
              <div className="level-approvers">
                {approvals.map((approval) => (
                  <div className="simulation-node approver-node" key={approval.Nik}>
                    <span>{approval.SourceType.map(sourceLabel).join(", ")}</span>
                    <strong>{approval.Name}</strong>
                    <small>{approval.Position || approval.Email}</small>
                  </div>
                ))}
              </div>
            </div>
          </React.Fragment>
        ))}

        {!simulation.approvals.length && (
          <>
            <ArrowRight className="flow-icon muted" size={20} />
            <div className="simulation-node empty-node">
              <span>Hasil</span>
              <strong>Tidak ada approver</strong>
              <small>Belum ada rule yang cocok untuk contoh ini.</small>
            </div>
          </>
        )}
      </div>

      <div className="simulation-summary">
        <strong>{simulation.approvals.length} approver akan dibuat.</strong>
        <span>
          Rule dengan approver yang sama digabung, level terendah dipakai, dan sumber approval ditampilkan bersama.
        </span>
      </div>

      <div className="table-wrap">
        <table className="simulation-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Rule</th>
              <th>Level</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {simulation.ruleResults.map((rule) => (
              <tr key={rule.id}>
                <td>
                  <span className={`rule-status ${rule.matched ? "matched" : "skipped"}`}>
                    {rule.matched ? <CheckCircle2 size={15} /> : <CircleSlash size={15} />}
                    {rule.matched ? "Masuk" : "Lewat"}
                  </span>
                </td>
                <td>{rule.type}</td>
                <td>{rule.level}</td>
                <td>{rule.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!simulation.ruleResults.length && <EmptyState>Belum ada workflow untuk modul ini.</EmptyState>}
      </div>
    </section>
  );
}

export function WorkflowTab({
  workflows,
  employees,
  moduleOptions,
  workflowForm,
  setWorkflowForm,
  requiresNik,
  requiresValue,
  saving,
  onSave,
  onTypeChange,
  onEdit,
  onDelete,
}) {
  const selectedApprover = employees.find((employee) => String(employee.Nik) === String(workflowForm.Nik));
  const workflowRows = useMemo(() => [...workflows].sort(compareWorkflowByProcedure), [workflows]);

  return (
    <div className="workflow-page">
      <div className="two-column">
        <section className="panel">
          <PanelHeader
            icon={Workflow}
            title={workflowForm.id ? "Edit Workflow" : "Tambah Workflow"}
            subtitle="Atur approver per modul, tipe, threshold, dan level."
          />
          <form className="form-grid" onSubmit={onSave}>
            <Field label="Nama Modul">
              <select
                value={workflowForm.Modul_id}
                onChange={(event) => setWorkflowForm((current) => ({ ...current, Modul_id: event.target.value }))}
                required
              >
                <option value="">Pilih modul</option>
                {moduleOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.id} - {item.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Tipe">
              <select value={workflowForm.Type} onChange={(event) => onTypeChange(event.target.value)}>
                {approvalTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Level">
              <input
                type="number"
                min="1"
                value={workflowForm.Level}
                onChange={(event) => setWorkflowForm((current) => ({ ...current, Level: event.target.value }))}
                required
              />
            </Field>
            <Field label="Value">
              <input
                type="number"
                min="0"
                value={workflowForm.Value}
                onChange={(event) => setWorkflowForm((current) => ({ ...current, Value: event.target.value }))}
                disabled={!requiresValue}
                required={requiresValue}
              />
            </Field>
            <Field label="NIK Approver">
              <select
                value={workflowForm.Nik}
                onChange={(event) => setWorkflowForm((current) => ({ ...current, Nik: event.target.value }))}
                disabled={!requiresNik}
                required={requiresNik}
              >
                <option value="">Pilih pegawai</option>
                {employees.map((employee) => (
                  <option key={employee.Nik} value={employee.Nik}>
                    {employee.Nik} - {employee.Name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Name">
              <input value={requiresNik ? selectedApprover?.Name || "" : ""} disabled readOnly />
            </Field>
            <Field label="Email">
              <input value={requiresNik ? selectedApprover?.Email || "" : ""} disabled readOnly />
            </Field>
            <Field label="Position">
              <input value={requiresNik ? selectedApprover?.Position || "" : ""} disabled readOnly />
            </Field>
            <div className="form-actions">
              <button className="primary-button" disabled={saving} type="submit">
                <Save size={17} />
                Simpan
              </button>
              <button className="secondary-button" type="button" onClick={() => setWorkflowForm(emptyWorkflow)}>
                Batal
              </button>
            </div>
          </form>
        </section>

        <section className="panel">
          <PanelHeader
            icon={Workflow}
            title="Daftar Workflow"
            subtitle="Urutan dan arti data mengikuti cara dbo.SubmitNeedApproval membaca rule."
          />
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Modul</th>
                  <th>Tipe</th>
                  <th>Value</th>
                  <th>Approver Procedure</th>
                  <th>Level Need Approval</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {workflowRows.map((workflow) => {
                  const approver = workflowApproverLabel(workflow);

                  return (
                    <tr key={rowId(workflow)}>
                      <td>
                        <strong>{workflow.Modul}</strong>
                        <span>ID {workflow.Modul_id || "-"}</span>
                      </td>
                      <td>
                        <strong>{workflow.Type}</strong>
                        {workflow.Type?.startsWith("Total Amount") && <span>Dicek dengan nominal transaksi</span>}
                        {workflow.Type === "Custom" && <span>Selalu masuk jika NIK tersedia</span>}
                        {workflow.Type === "HRIS" && <span>Selalu masuk jika pembuat punya approver</span>}
                      </td>
                      <td>{workflowValueLabel(workflow)}</td>
                      <td>
                        <strong>{approver.title}</strong>
                        <span>{approver.subtitle}</span>
                      </td>
                      <td>{workflowLevelLabel(workflow)}</td>
                      <td className="row-actions">
                        <button className="icon-button" onClick={() => onEdit(workflow)} title="Edit workflow">
                          <Edit3 size={16} />
                        </button>
                        <button
                          className="icon-button danger"
                          onClick={() => onDelete("workflow", rowId(workflow))}
                          title="Hapus workflow"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!workflowRows.length && <EmptyState>Belum ada workflow approval.</EmptyState>}
          </div>
        </section>
      </div>

      <WorkflowSimulation workflows={workflows} employees={employees} moduleOptions={moduleOptions} />
    </div>
  );
}
