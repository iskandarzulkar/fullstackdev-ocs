const { sql, poolPromise } = require("../../../config/database");

const getAllEmployees = async () => {
    const pool = await poolPromise;
    const result = await pool.request().query(`
        SELECT * FROM Employee ORDER BY Name ASC
    `);
    return result.recordset;
};

const getEmployeeByNik = async (nik) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("Nik", sql.NVarChar(14), nik)
        .query(`SELECT * FROM Employee WHERE Nik = @Nik`);

    return result.recordset[0];
};

const createEmployee = async (data) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("Nik", sql.NVarChar(14), data.Nik)
        .input("Name", sql.NVarChar(150), data.Name)
        .input("Email", sql.NVarChar(150), data.Email)
        .input("Position", sql.NVarChar(100), data.Position)
        .input("Approver1_name", sql.NVarChar(150), data.Approver1_name || null)
        .input("Approver1_email", sql.NVarChar(150), data.Approver1_email || null)
        .input("Approver1_position", sql.NVarChar(100), data.Approver1_position || null)
        .input("Approver2_name", sql.NVarChar(150), data.Approver2_name || null)
        .input("Approver2_email", sql.NVarChar(150), data.Approver2_email || null)
        .input("Approver2_position", sql.NVarChar(100), data.Approver2_position || null)
        .query(`
        INSERT INTO Employee (
            Nik, Name, Email, Position,
            Approver1_name, Approver1_email, Approver1_position,
            Approver2_name, Approver2_email, Approver2_position
        )
        OUTPUT INSERTED.*
        VALUES (
            @Nik, @Name, @Email, @Position,
            @Approver1_name, @Approver1_email, @Approver1_position,
            @Approver2_name, @Approver2_email, @Approver2_position
        )
        `);

    return result.recordset[0];
};

const updateEmployee = async (nik, data) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("Nik", sql.NVarChar(14), nik)
        .input("Name", sql.NVarChar(150), data.Name)
        .input("Email", sql.NVarChar(150), data.Email)
        .input("Position", sql.NVarChar(100), data.Position)
        .input("Approver1_name", sql.NVarChar(150), data.Approver1_name || null)
        .input("Approver1_email", sql.NVarChar(150), data.Approver1_email || null)
        .input("Approver1_position", sql.NVarChar(100), data.Approver1_position || null)
        .input("Approver2_name", sql.NVarChar(150), data.Approver2_name || null)
        .input("Approver2_email", sql.NVarChar(150), data.Approver2_email || null)
        .input("Approver2_position", sql.NVarChar(100), data.Approver2_position || null)
        .query(`
        UPDATE Employee SET
            Name = @Name,
            Email = @Email,
            Position = @Position,
            Approver1_name = @Approver1_name,
            Approver1_email = @Approver1_email,
            Approver1_position = @Approver1_position,
            Approver2_name = @Approver2_name,
            Approver2_email = @Approver2_email,
            Approver2_position = @Approver2_position,
            updated_at = SYSDATETIME()
        OUTPUT INSERTED.*
        WHERE Nik = @Nik
        `);

    return result.recordset[0];
};

const deleteEmployee = async (nik) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("Nik", sql.NVarChar(14), nik)
        .query(`DELETE FROM Employee OUTPUT DELETED.* WHERE Nik = @Nik`);

    return result.recordset[0];
};

module.exports = {
    getAllEmployees,
    getEmployeeByNik,
    createEmployee,
    updateEmployee,
    deleteEmployee,
};