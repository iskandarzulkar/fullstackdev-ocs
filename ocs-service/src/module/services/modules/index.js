const moduleModel = require("../../models/modules");

const validateModulePayload = (payload, isCreate = true) => {
    if (isCreate && (payload.id === undefined || payload.id === null || payload.id === "")) {
        throw { statusCode: 400, message: "Modul_id wajib diisi" };
    }

    if (isCreate && (!Number.isInteger(Number(payload.id)) || Number(payload.id) < 1)) {
        throw { statusCode: 400, message: "Modul_id harus angka lebih dari 0" };
    }

    if (!payload.Name) {
        throw { statusCode: 400, message: "Nama modul wajib diisi" };
    }

    return {
        id: Number(payload.id),
        Name: String(payload.Name).trim(),
    };
};

const getAllModules = () => moduleModel.getAllModules();

const getModuleById = async (id) => {
    const data = await moduleModel.getModuleById(id);
    if (!data) throw { statusCode: 404, message: "Modul tidak ditemukan" };

    return data;
};

const createModule = async (payload) => {
    const data = validateModulePayload(payload);
    const exists = await moduleModel.getModuleById(data.id);
    if (exists) throw { statusCode: 409, message: "Modul_id sudah terdaftar" };

    return moduleModel.createModule(data);
};

const updateModule = async (id, payload) => {
    await getModuleById(id);
    const data = validateModulePayload({ ...payload, id }, false);

    return moduleModel.updateModule(id, data);
};

const deleteModule = async (id) => {
    await getModuleById(id);
    return moduleModel.deleteModule(id);
};

module.exports = {
    getAllModules,
    getModuleById,
    createModule,
    updateModule,
    deleteModule,
};
