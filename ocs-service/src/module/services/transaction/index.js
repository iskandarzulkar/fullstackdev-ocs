const transactionModel = require("../../models/transactions");
const employeeService = require("../employee");
const moduleService = require("../modules");

const validateTransaction = async (data) => {
    if (!data.Modul_id) throw { statusCode: 400, message: "Modul_id wajib diisi" };
    if (data.Amount === undefined || data.Amount === null) throw { statusCode: 400, message: "Amount wajib diisi" };
    if (Number(data.Amount) < 0) throw { statusCode: 400, message: "Amount tidak boleh minus" };
    if (!data.createdBy) throw { statusCode: 400, message: "createdBy wajib diisi" };

    await moduleService.getModuleById(data.Modul_id);
    await employeeService.getEmployeeByNik(data.createdBy);
};

const getAllTransactions = () => transactionModel.getAllTransactions();

const getTransactionById = async (id) => {
    const transaction = await transactionModel.getTransactionById(id);
    if (!transaction) throw { statusCode: 404, message: "Transaksi tidak ditemukan" };

    return transaction;
};

const createTransaction = async (payload) => {
    await validateTransaction(payload);
    return transactionModel.createTransaction(payload);
};

const updateTransaction = async (id, payload) => {
    await getTransactionById(id);
    await validateTransaction(payload);

    return transactionModel.updateTransaction(id, payload);
};

const deleteTransaction = async (id) => {
    await getTransactionById(id);
    return transactionModel.deleteTransaction(id);
};

const submitApproval = async (id) => {
    await getTransactionById(id);
    return transactionModel.submitApproval(id);
};

module.exports = {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    submitApproval,
};
