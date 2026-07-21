const { sql, poolPromise } = require("../../../config/database");

const getAllModules = async () => {
    const pool = await poolPromise;
    const result = await pool.request().query(`
        SELECT * FROM Modules ORDER BY id ASC
    `);
    return result.recordset;
};

const getModuleById = async (id) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("id", sql.Int, id)
        .query(`SELECT * FROM Modules WHERE id = @id`);

    return result.recordset[0];
};

const createModule = async (data) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("id", sql.Int, data.id)
        .input("Name", sql.NVarChar(100), data.Name)
        .query(`
        INSERT INTO Modules (id, Name)
        OUTPUT INSERTED.*
        VALUES (@id, @Name)
        `);

    return result.recordset[0];
};

const updateModule = async (id, data) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("id", sql.Int, id)
        .input("Name", sql.NVarChar(100), data.Name)
        .query(`
        UPDATE Modules SET
            Name = @Name,
            updated_at = SYSDATETIME()
        OUTPUT INSERTED.*
        WHERE id = @id;

        UPDATE WorkflowApproval
        SET Modul = @Name,
            updated_at = SYSDATETIME()
        WHERE Modul_id = @id;
        `);

    return result.recordset[0];
};

const deleteModule = async (id) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("id", sql.Int, id)
        .query(`DELETE FROM Modules OUTPUT DELETED.* WHERE id = @id`);

    return result.recordset[0];
};

module.exports = {
    getAllModules,
    getModuleById,
    createModule,
    updateModule,
    deleteModule,
};
