const { sql, poolPromise } = require("../../../config/database");

const getAllNeedApprovals = async () => {
    const pool = await poolPromise;
    const result = await pool.request().query(`
        SELECT * FROM NeedApproval ORDER BY Transaction_Id ASC, [Level] ASC, Name ASC, id ASC
    `);
    return result.recordset;
};

const getNeedApprovalById = async (id) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("id", sql.Int, id)
        .query(`SELECT * FROM NeedApproval WHERE id = @id`);

    return result.recordset[0];
};

const getNeedApprovalsByTransactionId = async (transactionId) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("Transaction_Id", sql.Int, transactionId)
        .query(`
        SELECT * FROM NeedApproval
        WHERE Transaction_Id = @Transaction_Id
        ORDER BY [Level] ASC, Name ASC, id ASC
        `);

    return result.recordset;
};

const createNeedApproval = async (data) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("Modul_id", sql.Int, data.Modul_id)
        .input("Transaction_Id", sql.Int, data.Transaction_Id)
        .input("Nik", sql.NVarChar(14), data.Nik)
        .input("Name", sql.NVarChar(150), data.Name)
        .input("Email", sql.NVarChar(150), data.Email)
        .input("Position", sql.NVarChar(100), data.Position)
        .input("Level", sql.Int, data.Level)
        .input("SourceType", sql.NVarChar(200), data.SourceType || "Manual")
        .query(`
        INSERT INTO NeedApproval (
            Modul_id, Transaction_Id, Nik, Name, Email, Position, [Level], SourceType
        )
        OUTPUT INSERTED.*
        VALUES (
            @Modul_id, @Transaction_Id, @Nik, @Name, @Email, @Position, @Level, @SourceType
        )
        `);

    return result.recordset[0];
};

const updateNeedApproval = async (id, data) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("id", sql.Int, id)
        .input("Modul_id", sql.Int, data.Modul_id)
        .input("Transaction_Id", sql.Int, data.Transaction_Id)
        .input("Nik", sql.NVarChar(14), data.Nik)
        .input("Name", sql.NVarChar(150), data.Name)
        .input("Email", sql.NVarChar(150), data.Email)
        .input("Position", sql.NVarChar(100), data.Position)
        .input("Level", sql.Int, data.Level)
        .input("SourceType", sql.NVarChar(200), data.SourceType || "Manual")
        .query(`
        UPDATE NeedApproval SET
            Modul_id = @Modul_id,
            Transaction_Id = @Transaction_Id,
            Nik = @Nik,
            Name = @Name,
            Email = @Email,
            Position = @Position,
            [Level] = @Level,
            SourceType = @SourceType,
            updated_at = SYSDATETIME()
        OUTPUT INSERTED.*
        WHERE id = @id
        `);

    return result.recordset[0];
};

const deleteNeedApproval = async (id) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("id", sql.Int, id)
        .query(`DELETE FROM NeedApproval OUTPUT DELETED.* WHERE id = @id`);

    return result.recordset[0];
};

module.exports = {
    getAllNeedApprovals,
    getNeedApprovalById,
    getNeedApprovalsByTransactionId,
    createNeedApproval,
    updateNeedApproval,
    deleteNeedApproval,
};
