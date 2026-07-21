const workflowApprovalService = require("../../services/workflow");
const response = require("../../../utils/response");

const getAllWorkflowApprovals = async (req, res) => {
    try {
        const data = await workflowApprovalService.getAllWorkflowApprovals();
        return response.success(res, "Data workflow approval berhasil diambil", data);
    } catch (err) {
        return response.error(res, err.message, err.statusCode || 500);
    }
};

const getWorkflowApprovalById = async (req, res) => {
    try {
        const data = await workflowApprovalService.getWorkflowApprovalById(req.params.id);
        return response.success(res, "Detail workflow approval berhasil diambil", data);
    } catch (err) {
        return response.error(res, err.message, err.statusCode || 500);
    }
};

const createWorkflowApproval = async (req, res) => {
    try {
        const data = await workflowApprovalService.createWorkflowApproval(req.body);
        return response.success(res, "Workflow approval berhasil dibuat", data, 201);
    } catch (err) {
        return response.error(res, err.message, err.statusCode || 500);
    }
};

const updateWorkflowApproval = async (req, res) => {
    try {
        const data = await workflowApprovalService.updateWorkflowApproval(req.params.id, req.body);
        return response.success(res, "Workflow approval berhasil diperbarui", data);
    } catch (err) {
        return response.error(res, err.message, err.statusCode || 500);
    }
};

const deleteWorkflowApproval = async (req, res) => {
    try {
        const data = await workflowApprovalService.deleteWorkflowApproval(req.params.id);
        return response.success(res, "Workflow approval berhasil dihapus", data);
    } catch (err) {
        return response.error(res, err.message, err.statusCode || 500);
    }
};

module.exports = {
    getAllWorkflowApprovals,
    getWorkflowApprovalById,
    createWorkflowApproval,
    updateWorkflowApproval,
    deleteWorkflowApproval,
};