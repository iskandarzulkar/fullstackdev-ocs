const { sql, poolPromise } = require("../../../config/database");

const getAllWorkflowApprovals = async () => {
    const pool = await poolPromise;
    const result = await pool.request().query(`
        SELECT * FROM WorkflowApproval ORDER BY Modul_id ASC, [Level] ASC, id DESC
    `);
    return result.recordset;
};

const getWorkflowApprovalById = async (id) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("id", sql.Int, id)
        .query(`SELECT * FROM WorkflowApproval WHERE id = @id`);

    return result.recordset[0];
};

const createWorkflowApproval = async (data) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("Modul_id", sql.Int, data.Modul_id)
        .input("Modul", sql.NVarChar(100), data.Modul)
        .input("Type", sql.NVarChar(50), data.Type)
        .input("Value", sql.Decimal(18, 2), data.Value)
        .input("Level", sql.Int, data.Level)
        .input("Nik", sql.NVarChar(14), data.Nik)
        .input("Name", sql.NVarChar(150), data.Name)
        .input("Email", sql.NVarChar(150), data.Email)
        .input("Position", sql.NVarChar(100), data.Position)
        .query(`
        INSERT INTO WorkflowApproval (Modul_id, Modul, [Type], [Value], [Level], Nik, Name, Email, Position)
        OUTPUT INSERTED.*
        VALUES (@Modul_id, @Modul, @Type, @Value, @Level, @Nik, @Name, @Email, @Position)
        `);

    return result.recordset[0];
};

const updateWorkflowApproval = async (id, data) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("id", sql.Int, id)
        .input("Modul_id", sql.Int, data.Modul_id)
        .input("Modul", sql.NVarChar(100), data.Modul)
        .input("Type", sql.NVarChar(50), data.Type)
        .input("Value", sql.Decimal(18, 2), data.Value)
        .input("Level", sql.Int, data.Level)
        .input("Nik", sql.NVarChar(14), data.Nik)
        .input("Name", sql.NVarChar(150), data.Name)
        .input("Email", sql.NVarChar(150), data.Email)
        .input("Position", sql.NVarChar(100), data.Position)
        .query(`
        UPDATE WorkflowApproval SET
            Modul_id = @Modul_id,
            Modul = @Modul,
            [Type] = @Type,
            [Value] = @Value,
            [Level] = @Level,
            Nik = @Nik,
            Name = @Name,
            Email = @Email,
            Position = @Position,
            updated_at = SYSDATETIME()
        OUTPUT INSERTED.*
        WHERE id = @id
        `);

    return result.recordset[0];
};

const deleteWorkflowApproval = async (id) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("id", sql.Int, id)
        .query(`DELETE FROM WorkflowApproval OUTPUT DELETED.* WHERE id = @id`);

    return result.recordset[0];
};

module.exports = {
    getAllWorkflowApprovals,
    getWorkflowApprovalById,
    createWorkflowApproval,
    updateWorkflowApproval,
    deleteWorkflowApproval,
};
