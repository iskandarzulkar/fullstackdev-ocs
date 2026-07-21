const { sql, poolPromise } = require("../../../config/database");

const getAllTransactions = async () => {
    const pool = await poolPromise;
    const result = await pool.request().query(`
        SELECT t.*, e.Name AS createdByName, m.Name AS Modul
        FROM Transactions t
        LEFT JOIN Employee e ON e.Nik = t.createdBy
        LEFT JOIN Modules m ON m.id = t.Modul_id
        ORDER BY t.id DESC
    `);
    return result.recordset;
};


const getTransactionById = async (id) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("id", sql.Int, id)
        .query(`SELECT * FROM Transactions WHERE id = @id`);

    return result.recordset[0];
};

const createTransaction = async (data) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("Modul_id", sql.Int, data.Modul_id)
        .input("Amount", sql.Decimal(18, 2), data.Amount)
        .input("createdBy", sql.NVarChar(14), data.createdBy)
        .query(`
        INSERT INTO Transactions (Modul_id, Amount, createdBy)
        OUTPUT INSERTED.*
        VALUES (@Modul_id, @Amount, @createdBy)
        `);

    return result.recordset[0];
};

const updateTransaction = async (id, data) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("id", sql.Int, id)
        .input("Modul_id", sql.Int, data.Modul_id)
        .input("Amount", sql.Decimal(18, 2), data.Amount)
        .input("createdBy", sql.NVarChar(14), data.createdBy)
        .query(`
        UPDATE Transactions SET
            Modul_id = @Modul_id,
            Amount = @Amount,
            createdBy = @createdBy,
            updated_at = SYSDATETIME()
        OUTPUT INSERTED.*
        WHERE id = @id
        `);

    return result.recordset[0];
};

const deleteTransaction = async (id) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("id", sql.Int, id)
        .query(`DELETE FROM Transactions OUTPUT DELETED.* WHERE id = @id`);

    return result.recordset[0];
};

const submitApproval = async (id) => {
    const pool = await poolPromise;

    await pool.request()
        .input("Transaction_Id", sql.Int, id)
        .execute("dbo.SubmitNeedApproval");

    const result = await pool.request()
        .input("Transaction_Id", sql.Int, id)
        .query(`
        SELECT *
        FROM NeedApproval
        WHERE Transaction_Id = @Transaction_Id
        ORDER BY [Level] ASC, id ASC
        `);

    return result.recordset;
};

module.exports = {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    submitApproval,
};
