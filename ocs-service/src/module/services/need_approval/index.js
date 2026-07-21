const needApprovalModel = require("../../models/need_approval");

const transactionService = require("../transaction");
const employeeService = require("../employee");

const validateNeedApproval = async (payload) => {
    if (!payload.Modul_id) throw { statusCode: 400, message: "Modul_id wajib diisi" };
    if (!payload.Transaction_Id) throw { statusCode: 400, message: "Transaction_Id wajib diisi" };
    if (!payload.Nik) throw { statusCode: 400, message: "NIK wajib diisi" };
    if (payload.Level === undefined || payload.Level === null || payload.Level === "") {
        throw { statusCode: 400, message: "Level wajib diisi" };
    }

    const level = Number(payload.Level);
    if (!Number.isInteger(level) || level < 1) {
        throw { statusCode: 400, message: "Level harus angka lebih dari 0" };
    }

    await transactionService.getTransactionById(payload.Transaction_Id);
    const employee = await employeeService.getEmployeeByNik(payload.Nik);

    return {
        Modul_id: payload.Modul_id,
        Transaction_Id: payload.Transaction_Id,
        Nik: employee.Nik,
        Name: employee.Name,
        Email: employee.Email,
        Position: employee.Position,
        Level: level,
        SourceType: payload.SourceType || "Manual",
    };
};

const getAllNeedApprovals = () => needApprovalModel.getAllNeedApprovals();

const getNeedApprovalById = async (id) => {
    const data = await needApprovalModel.getNeedApprovalById(id);
    if (!data) throw { statusCode: 404, message: "Need approval tidak ditemukan" };

    return data;
};

const getNeedApprovalsByTransactionId = async (transactionId) => {
    await transactionService.getTransactionById(transactionId);
    return needApprovalModel.getNeedApprovalsByTransactionId(transactionId);
};

const createNeedApproval = async (payload) => {
    const data = await validateNeedApproval(payload);
    return needApprovalModel.createNeedApproval(data);
};

const updateNeedApproval = async (id, payload) => {
    await getNeedApprovalById(id);
    const data = await validateNeedApproval(payload);

    return needApprovalModel.updateNeedApproval(id, data);
};

const deleteNeedApproval = async (id) => {
    await getNeedApprovalById(id);
    return needApprovalModel.deleteNeedApproval(id);
};

module.exports = {
    getAllNeedApprovals,
    getNeedApprovalById,
    getNeedApprovalsByTransactionId,
    createNeedApproval,
    updateNeedApproval,
    deleteNeedApproval,
};
