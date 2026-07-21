const transactionService = require("../../services/transaction");
const response = require("../../../utils/response");

const getAllTransactions = async (req, res) => {
    try {
        const data = await transactionService.getAllTransactions();
        return response.success(res, "Data transaksi berhasil diambil", data);
    } catch (err) {
        return response.error(res, err.message, err.statusCode || 500);
    }
};

const getTransactionById = async (req, res) => {
    try {
        const data = await transactionService.getTransactionById(req.params.id);
        return response.success(res, "Detail transaksi berhasil diambil", data);
    } catch (err) {
        return response.error(res, err.message, err.statusCode || 500);
    }
};

const createTransaction = async (req, res) => {
    try {
        const data = await transactionService.createTransaction(req.body);
        return response.success(res, "Transaksi berhasil dibuat", data, 201);
    } catch (err) {
        return response.error(res, err.message, err.statusCode || 500);
    }
};

const updateTransaction = async (req, res) => {
    try {
        const data = await transactionService.updateTransaction(req.params.id, req.body);
        return response.success(res, "Transaksi berhasil diperbarui", data);
    } catch (err) {
        return response.error(res, err.message, err.statusCode || 500);
    }
};

const deleteTransaction = async (req, res) => {
    try {
        const data = await transactionService.deleteTransaction(req.params.id);
        return response.success(res, "Transaksi berhasil dihapus", data);
    } catch (err) {
        return response.error(res, err.message, err.statusCode || 500);
    }
};

const submitApproval = async (req, res) => {
    try {
        const data = await transactionService.submitApproval(req.params.id);
        return response.success(res, "Approval transaksi berhasil diajukan", data);
    } catch (err) {
        return response.error(res, err.message, err.statusCode || 500);
    }
};

module.exports = {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    submitApproval,
};
