const moduleService = require("../../services/modules");
const response = require("../../../utils/response");

const getAllModules = async (req, res) => {
    try {
        const data = await moduleService.getAllModules();
        return response.success(res, "Data modul berhasil diambil", data);
    } catch (err) {
        return response.error(res, err.message, err.statusCode || 500);
    }
};

const getModuleById = async (req, res) => {
    try {
        const data = await moduleService.getModuleById(req.params.id);
        return response.success(res, "Detail modul berhasil diambil", data);
    } catch (err) {
        return response.error(res, err.message, err.statusCode || 500);
    }
};

const createModule = async (req, res) => {
    try {
        const data = await moduleService.createModule(req.body);
        return response.success(res, "Modul berhasil dibuat", data, 201);
    } catch (err) {
        return response.error(res, err.message, err.statusCode || 500);
    }
};

const updateModule = async (req, res) => {
    try {
        const data = await moduleService.updateModule(req.params.id, req.body);
        return response.success(res, "Modul berhasil diperbarui", data);
    } catch (err) {
        return response.error(res, err.message, err.statusCode || 500);
    }
};

const deleteModule = async (req, res) => {
    try {
        const data = await moduleService.deleteModule(req.params.id);
        return response.success(res, "Modul berhasil dihapus", data);
    } catch (err) {
        return response.error(res, err.message, err.statusCode || 500);
    }
};

module.exports = {
    getAllModules,
    getModuleById,
    createModule,
    updateModule,
    deleteModule,
};
