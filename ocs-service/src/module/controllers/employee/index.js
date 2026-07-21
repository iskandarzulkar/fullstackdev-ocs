const employeeService = require("../../services/employee");
const response = require("../../../utils/response");

const getAllEmployees = async (req, res) => {
    try {
        const data = await employeeService.getAllEmployees();
        return response.success(res, "Data pegawai berhasil diambil", data);
    } catch (err) {
        return response.error(res, err.message, err.statusCode || 500);
    }
};

const getEmployeeByNik = async (req, res) => {
    try {
        const data = await employeeService.getEmployeeByNik(req.params.nik);
        return response.success(res, "Detail pegawai berhasil diambil", data);
    } catch (err) {
        return response.error(res, err.message, err.statusCode || 500);
    }
};

const createEmployee = async (req, res) => {
    try {
        const data = await employeeService.createEmployee(req.body);
        return response.success(res, "Pegawai berhasil dibuat", data, 201);
    } catch (err) {
        return response.error(res, err.message, err.statusCode || 500);
    }
};

const updateEmployee = async (req, res) => {
    try {
        const data = await employeeService.updateEmployee(req.params.nik, req.body);
        return response.success(res, "Pegawai berhasil diperbarui", data);
    } catch (err) {
        return response.error(res, err.message, err.statusCode || 500);
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const data = await employeeService.deleteEmployee(req.params.nik);
        return response.success(res, "Pegawai berhasil dihapus", data);
    } catch (err) {
        return response.error(res, err.message, err.statusCode || 500);
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeByNik,
    createEmployee,
    updateEmployee,
    deleteEmployee,
};