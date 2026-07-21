const employeeModel = require("../../models/employee");

const isNikValid = (nik) => /^[0-9]{14}$/.test(String(nik || ""));

const validateEmployee = (data) => {
    if (!isNikValid(data.Nik)) throw { statusCode: 400, message: "NIK harus 14 digit angka" };
    if (!data.Name) throw { statusCode: 400, message: "Nama wajib diisi" };
    if (!data.Email) throw { statusCode: 400, message: "Email wajib diisi" };
    if (!data.Position) throw { statusCode: 400, message: "Position wajib diisi" };
};

const getAllEmployees = () => employeeModel.getAllEmployees();

const getEmployeeByNik = async (nik) => {
    if (!isNikValid(nik)) throw { statusCode: 400, message: "NIK harus 14 digit angka" };

    const employee = await employeeModel.getEmployeeByNik(nik);
    if (!employee) throw { statusCode: 404, message: "Pegawai tidak ditemukan" };

    return employee;
};

const createEmployee = async (payload) => {
    validateEmployee(payload);

    const exists = await employeeModel.getEmployeeByNik(payload.Nik);
    if (exists) throw { statusCode: 409, message: "NIK sudah terdaftar" };

    return employeeModel.createEmployee(payload);
};

const updateEmployee = async (nik, payload) => {
    await getEmployeeByNik(nik);
    validateEmployee({ ...payload, Nik: nik });

    return employeeModel.updateEmployee(nik, payload);
};

const deleteEmployee = async (nik) => {
    await getEmployeeByNik(nik);
    return employeeModel.deleteEmployee(nik);
};

module.exports = {
    isNikValid,
    getAllEmployees,
    getEmployeeByNik,
    createEmployee,
    updateEmployee,
    deleteEmployee,
};