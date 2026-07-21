import React from "react";
import { Database, Workflow } from "lucide-react";
import { EmptyState, PanelHeader } from "../ui/index.js";

export function DashboardTab({ modules, employees, workflows, transactions, needApprovals, workflowByModule }) {
  return (
    <section className="dashboard">
      <div className="metric-grid">
        <div className="metric">
          <span>Modul</span>
          <strong>{modules.length}</strong>
        </div>
        <div className="metric">
          <span>Pegawai</span>
          <strong>{employees.length}</strong>
        </div>
        <div className="metric">
          <span>Workflow</span>
          <strong>{workflows.length}</strong>
        </div>
        <div className="metric">
          <span>Transaksi</span>
          <strong>{transactions.length}</strong>
        </div>
        <div className="metric">
          <span>Need Approval</span>
          <strong>{needApprovals.length}</strong>
        </div>
      </div>

      <section className="panel">
        <PanelHeader
          icon={Workflow}
          title="Flow Approval"
          subtitle="Urutan proses dari master data sampai stored procedure mengisi NeedApproval."
        />
        <div className="flow">
          <div>Modules</div>
          <span></span>
          <div>Employee</div>
          <span></span>
          <div>WorkflowApproval</div>
          <span></span>
          <div>Transactions</div>
          <span></span>
          <div>dbo.SubmitNeedApproval</div>
          <span></span>
          <div>NeedApproval</div>
        </div>
      </section>

      <section className="panel">
        <PanelHeader
          icon={Database}
          title="Workflow Per Modul"
          subtitle="Jumlah rule approval yang aktif berdasarkan nama modul."
        />
        <div className="module-list">
          {Object.entries(workflowByModule).map(([name, count]) => (
            <div key={name}>
              <strong>{name}</strong>
              <span>{count} rule</span>
            </div>
          ))}
          {!Object.keys(workflowByModule).length && <EmptyState>Belum ada workflow approval.</EmptyState>}
        </div>
      </section>
    </section>
  );
}
