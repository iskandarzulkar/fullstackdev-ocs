const needApprovalService = require("../../services/need_approval");
const response = require("../../../utils/response");

const getAllNeedApprovals = async (req, res) => {
    try {
        const data = await needApprovalService.getAllNeedApprovals();
        return response.success(res, "Data need approval berhasil diambil", data);
    } catch (err) {
        return response.error(res, err.message, err.statusCode || 500);
    }
};

const getNeedApprovalById = async (req, res) => {
    try {
        const data = await needApprovalService.getNeedApprovalById(req.params.id);
        return response.success(res, "Detail need approval berhasil diambil", data);
    } catch (err) {
        return response.error(res, err.message, err.statusCode || 500);
    }
};

const getNeedApprovalsByTransactionId = async (req, res) => {
    try {
        const data = await needApprovalService.getNeedApprovalsByTransactionId(req.params.transactionId);
        return response.success(res, "Data need approval transaksi berhasil diambil", data);
    } catch (err) {
        return response.error(res, err.message, err.statusCode || 500);
    }
};

const createNeedApproval = async (req, res) => {
    try {
        const data = await needApprovalService.createNeedApproval(req.body);
        return response.success(res, "Need approval berhasil dibuat", data, 201);
    } catch (err) {
        return response.error(res, err.message, err.statusCode || 500);
    }
};

const updateNeedApproval = async (req, res) => {
    try {
        const data = await needApprovalService.updateNeedApproval(req.params.id, req.body);
        return response.success(res, "Need approval berhasil diperbarui", data);
    } catch (err) {
        return response.error(res, err.message, err.statusCode || 500);
    }
};

const deleteNeedApproval = async (req, res) => {
    try {
        const data = await needApprovalService.deleteNeedApproval(req.params.id);
        return response.success(res, "Need approval berhasil dihapus", data);
    } catch (err) {
        return response.error(res, err.message, err.statusCode || 500);
    }
};

module.exports = {
    getAllNeedApprovals,
    getNeedApprovalById,
    getNeedApprovalsByTransactionId,
    createNeedApproval,
    updateNeedApproval,
    deleteNeedApproval,
};