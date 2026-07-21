import React, { useEffect, useMemo, useState } from "react";
import { ClipboardList, Database, FileCheck2, Layers3, UserRound, Workflow } from "lucide-react";
import { apiRequest } from "./config/api.js";
import { emptyEmployee, emptyModule, emptyTransaction, emptyWorkflow } from "./constants/forms.js";
import { Sidebar } from "./components/layout/Sidebar.jsx";
import { Topbar } from "./components/layout/Topbar.jsx";
import { Notice } from "./components/ui/index.js";
import {
  DashboardTab,
  EmployeeTab,
  ModuleTab,
  NeedApprovalTab,
  TransactionTab,
  WorkflowTab,
} from "./components/tabs/index.js";
import { rowId } from "./utils/format.js";

const tabs = [
  { id: "dashboard", label: "Ringkasan", icon: Database },
  { id: "module", label: "Modul", icon: Layers3 },
  { id: "employee", label: "Pegawai", icon: UserRound },
  { id: "workflow", label: "Workflow", icon: Workflow },
  { id: "transaction", label: "Transaksi", icon: ClipboardList },
  { id: "needApproval", label: "Need Approval", icon: FileCheck2 },
];

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [modules, setModules] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [needApprovals, setNeedApprovals] = useState([]);
  const [selectedApprovalTransactionId, setSelectedApprovalTransactionId] = useState("");
  const [moduleForm, setModuleForm] = useState(emptyModule);
  const [employeeForm, setEmployeeForm] = useState(emptyEmployee);
  const [workflowForm, setWorkflowForm] = useState(emptyWorkflow);
  const [transactionForm, setTransactionForm] = useState(emptyTransaction);
  const [editingModuleId, setEditingModuleId] = useState("");
  const [editingEmployeeNik, setEditingEmployeeNik] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState({ type: "", message: "" });

  const workflowByModule = useMemo(() => {
    return workflows.reduce((total, item) => {
      const key = item.Modul || "Tanpa modul";
      total[key] = (total[key] || 0) + 1;
      return total;
    }, {});
  }, [workflows]);

  const moduleOptions = useMemo(() => {
    return modules.map((item) => ({ id: String(item.id), name: item.Name }));
  }, [modules]);

  const moduleNameById = useMemo(() => {
    return modules.reduce((total, item) => {
      total[String(item.id)] = item.Name;
      return total;
    }, {});
  }, [modules]);

  const visibleApprovals = useMemo(() => {
    const filteredApprovals = selectedApprovalTransactionId
      ? needApprovals.filter((item) => String(item.Transaction_Id) === String(selectedApprovalTransactionId))
      : needApprovals;

    return [...filteredApprovals].sort((a, b) => {
      const trx = Number(a.Transaction_Id || 0) - Number(b.Transaction_Id || 0);
      if (trx !== 0) return trx;
      const level = Number(a.Level || 0) - Number(b.Level || 0);
      if (level !== 0) return level;
      const name = String(a.Name || "").localeCompare(String(b.Name || ""));
      if (name !== 0) return name;
      return Number(rowId(a) || 0) - Number(rowId(b) || 0);
    });
  }, [needApprovals, selectedApprovalTransactionId]);

  async function loadData() {
    setLoading(true);
    try {
      const [moduleData, employeeData, workflowData, transactionData, approvalData] = await Promise.all([
        apiRequest("/module"),
        apiRequest("/employee"),
        apiRequest("/workflow"),
        apiRequest("/transaction"),
        apiRequest("/approval"),
      ]);

      setModules(moduleData || []);
      setEmployees(employeeData || []);
      setWorkflows(workflowData || []);
      setTransactions(transactionData || []);
      setNeedApprovals(approvalData || []);
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function setWorkflowType(type) {
    setWorkflowForm((current) => ({
      ...current,
      Type: type,
      Value: type === "Custom" ? 0 : current.Value || "",
      Nik: type === "HRIS" ? "" : current.Nik,
    }));
  }

  function editEmployee(employee) {
    setEditingEmployeeNik(employee.Nik);
    setEmployeeForm({
      Nik: employee.Nik || "",
      Name: employee.Name || "",
      Email: employee.Email || "",
      Position: employee.Position || "",
      Approver1_name: employee.Approver1_name || "",
      Approver1_email: employee.Approver1_email || "",
      Approver1_position: employee.Approver1_position || "",
      Approver2_name: employee.Approver2_name || "",
      Approver2_email: employee.Approver2_email || "",
      Approver2_position: employee.Approver2_position || "",
    });
    setActiveTab("employee");
  }

  function editModule(moduleItem) {
    setEditingModuleId(moduleItem.id);
    setModuleForm({
      id: moduleItem.id,
      Name: moduleItem.Name || "",
    });
    setActiveTab("module");
  }

  function editWorkflow(workflow) {
    setWorkflowForm({
      id: rowId(workflow),
      Modul_id: workflow.Modul_id || 1,
      Type: workflow.Type || "Custom",
      Value: workflow.Value ?? 0,
      Level: workflow.Level || 1,
      Nik: workflow.Nik || "",
    });
    setActiveTab("workflow");
  }

  async function saveModule(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const method = editingModuleId ? "PUT" : "POST";
      const path = editingModuleId ? `/module/${editingModuleId}` : "/module";
      await apiRequest(path, {
        method,
        body: JSON.stringify({
          id: Number(moduleForm.id),
          Name: moduleForm.Name,
        }),
      });
      setModuleForm(emptyModule);
      setEditingModuleId("");
      setNotice({ type: "success", message: "Data modul berhasil disimpan." });
      await loadData();
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function saveEmployee(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const method = editingEmployeeNik ? "PUT" : "POST";
      const path = editingEmployeeNik ? `/employee/${editingEmployeeNik}` : "/employee";
      await apiRequest(path, {
        method,
        body: JSON.stringify(employeeForm),
      });
      setEmployeeForm(emptyEmployee);
      setEditingEmployeeNik("");
      setNotice({ type: "success", message: "Data pegawai berhasil disimpan." });
      await loadData();
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function saveWorkflow(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...workflowForm,
        Modul_id: Number(workflowForm.Modul_id),
        Value: workflowForm.Type === "Custom" ? 0 : workflowForm.Value,
        Level: workflowForm.Level,
      };
      const path = workflowForm.id ? `/workflow/${workflowForm.id}` : "/workflow";
      const method = workflowForm.id ? "PUT" : "POST";

      await apiRequest(path, {
        method,
        body: JSON.stringify(payload),
      });
      setWorkflowForm(emptyWorkflow);
      setNotice({ type: "success", message: "Workflow approval berhasil disimpan." });
      await loadData();
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function createTransaction(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await apiRequest("/transaction", {
        method: "POST",
        body: JSON.stringify({
          Modul_id: Number(transactionForm.Modul_id),
          Amount: Number(transactionForm.Amount),
          createdBy: transactionForm.createdBy,
        }),
      });
      setTransactionForm(emptyTransaction);
      setNotice({ type: "success", message: "Transaksi berhasil dibuat." });
      await loadData();
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function submitApproval(transactionId) {
    setSaving(true);
    try {
      const data = await apiRequest(`/transaction/${transactionId}/submit`, { method: "POST" });
      setSelectedApprovalTransactionId(String(transactionId));
      setNotice({
        type: "success",
        message: `${data.length || 0} approver berhasil dibuat untuk transaksi #${transactionId}.`,
      });
      await loadData();
      setActiveTab("needApproval");
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function deleteResource(type, id) {
    const messages = {
      module: "Hapus modul ini?",
      employee: "Hapus pegawai ini?",
      workflow: "Hapus workflow approval ini?",
      transaction: "Hapus transaksi ini?",
      approval: "Hapus need approval ini?",
    };

    if (!window.confirm(messages[type])) return;

    const paths = {
      module: `/module/${id}`,
      employee: `/employee/${id}`,
      workflow: `/workflow/${id}`,
      transaction: `/transaction/${id}`,
      approval: `/approval/${id}`,
    };

    setSaving(true);
    try {
      await apiRequest(paths[type], { method: "DELETE" });
      setNotice({ type: "success", message: "Data berhasil dihapus." });
      await loadData();
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    } finally {
      setSaving(false);
    }
  }

  const requiresNik = workflowForm.Type !== "HRIS";
  const requiresValue = workflowForm.Type !== "Custom";

  return (
    <main className="app-shell">
      <Sidebar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <section className="content">
        <Topbar loading={loading} onRefresh={loadData} />
        <Notice notice={notice} onClose={() => setNotice({ type: "", message: "" })} />

        {activeTab === "dashboard" && (
          <DashboardTab
            modules={modules}
            employees={employees}
            workflows={workflows}
            transactions={transactions}
            needApprovals={needApprovals}
            workflowByModule={workflowByModule}
          />
        )}

        {activeTab === "module" && (
          <ModuleTab
            modules={modules}
            moduleForm={moduleForm}
            setModuleForm={setModuleForm}
            editingModuleId={editingModuleId}
            setEditingModuleId={setEditingModuleId}
            saving={saving}
            onSave={saveModule}
            onEdit={editModule}
            onDelete={deleteResource}
          />
        )}

        {activeTab === "employee" && (
          <EmployeeTab
            employees={employees}
            employeeForm={employeeForm}
            setEmployeeForm={setEmployeeForm}
            editingEmployeeNik={editingEmployeeNik}
            setEditingEmployeeNik={setEditingEmployeeNik}
            saving={saving}
            onSave={saveEmployee}
            onEdit={editEmployee}
            onDelete={deleteResource}
          />
        )}

        {activeTab === "workflow" && (
          <WorkflowTab
            workflows={workflows}
            employees={employees}
            moduleOptions={moduleOptions}
            workflowForm={workflowForm}
            setWorkflowForm={setWorkflowForm}
            requiresNik={requiresNik}
            requiresValue={requiresValue}
            saving={saving}
            onSave={saveWorkflow}
            onTypeChange={setWorkflowType}
            onEdit={editWorkflow}
            onDelete={deleteResource}
          />
        )}

        {activeTab === "transaction" && (
          <TransactionTab
            transactions={transactions}
            employees={employees}
            moduleOptions={moduleOptions}
            transactionForm={transactionForm}
            setTransactionForm={setTransactionForm}
            saving={saving}
            onSave={createTransaction}
            onSubmitApproval={submitApproval}
            onDelete={deleteResource}
          />
        )}

        {activeTab === "needApproval" && (
          <NeedApprovalTab
            approvals={visibleApprovals}
            moduleNameById={moduleNameById}
            transactionFilter={selectedApprovalTransactionId}
            totalApprovals={needApprovals.length}
            onClearTransactionFilter={() => setSelectedApprovalTransactionId("")}
            onDelete={deleteResource}
          />
        )}
      </section>
    </main>
  );
}

export default App;
