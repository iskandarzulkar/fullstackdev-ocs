const workflowApprovalModel = require("../../models/workflow");
const employeeService = require("../employee");
const moduleService = require("../modules");

const allowedTypes = [
    "Custom",
    "HRIS",
    "Total Amount >=",
    "Total Amount >",
    "Total Amount <=",
    "Total Amount <",
];

const resolveLevel = (payload) => {
    const level = payload.Level === undefined || payload.Level === null || payload.Level === ""
        ? 1
        : Number(payload.Level);

    if (!Number.isInteger(level) || level < 1) {
        throw { statusCode: 400, message: "Level harus angka lebih dari 0" };
    }

    return level;
};

const validateWorkflowApproval = async (payload) => {
    if (payload.Modul_id === undefined || payload.Modul_id === null || payload.Modul_id === "") {
        throw { statusCode: 400, message: "Modul_id wajib diisi" };
    }
    if (!payload.Type) throw { statusCode: 400, message: "Type wajib diisi" };
    if (!allowedTypes.includes(payload.Type)) throw { statusCode: 400, message: "Type tidak valid" };

    const moduleData = await moduleService.getModuleById(payload.Modul_id);
    const Modul_id = moduleData.id;
    const Modul = moduleData.Name;
    const Level = resolveLevel(payload);

    if (payload.Type.startsWith("Total Amount") && (payload.Value === undefined || payload.Value === null || payload.Value === "")) {
        throw { statusCode: 400, message: "Value wajib diisi untuk aturan Total Amount" };
    }

    if (payload.Type === "HRIS") {
        return {
            Modul_id,
            Modul,
            Type: payload.Type,
            Value: Number(payload.Value || 0),
            Level,
            Nik: null,
            Name: null,
            Email: null,
            Position: null,
        };
    }

    if (!payload.Nik) throw { statusCode: 400, message: "NIK wajib diisi jika Type bukan HRIS" };

    const employee = await employeeService.getEmployeeByNik(payload.Nik);

    return {
        Modul_id,
        Modul,
        Type: payload.Type,
        Value: payload.Type === "Custom" ? 0 : Number(payload.Value),
        Level,
        Nik: employee.Nik,
        Name: employee.Name,
        Email: employee.Email,
        Position: employee.Position,
    };
};

const getAllWorkflowApprovals = () => workflowApprovalModel.getAllWorkflowApprovals();

const getWorkflowApprovalById = async (id) => {
    const data = await workflowApprovalModel.getWorkflowApprovalById(id);
    if (!data) throw { statusCode: 404, message: "Workflow approval tidak ditemukan" };

    return data;
};

const createWorkflowApproval = async (payload) => {
    const data = await validateWorkflowApproval(payload);
    return workflowApprovalModel.createWorkflowApproval(data);
};

const updateWorkflowApproval = async (id, payload) => {
    await getWorkflowApprovalById(id);
    const data = await validateWorkflowApproval(payload);

    return workflowApprovalModel.updateWorkflowApproval(id, data);
};

const deleteWorkflowApproval = async (id) => {
    await getWorkflowApprovalById(id);
    return workflowApprovalModel.deleteWorkflowApproval(id);
};

module.exports = {
    getAllWorkflowApprovals,
    getWorkflowApprovalById,
    createWorkflowApproval,
    updateWorkflowApproval,
    deleteWorkflowApproval,
};
