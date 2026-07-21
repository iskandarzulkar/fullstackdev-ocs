module.exports = {
  seed: async (request) => {
    await request.query(`
      INSERT INTO Transactions (Modul_id, Amount, createdBy)
      SELECT data.Modul_id, data.Amount, data.createdBy
      FROM (VALUES
        (1, 7500000, '74011306950001'),
        (1, 12000000, '74011306950008')
      ) AS data (Modul_id, Amount, createdBy)
      WHERE NOT EXISTS (
        SELECT 1
        FROM Transactions
        WHERE Transactions.Modul_id = data.Modul_id
          AND Transactions.Amount = data.Amount
          AND Transactions.createdBy = data.createdBy
      );
    `);
  },

  down: async (request) => {
    await request.query(`
      DELETE FROM Transactions
      WHERE Modul_id = 1
        AND (
          (Amount = 7500000 AND createdBy = '74011306950001')
          OR (Amount = 12000000 AND createdBy = '74011306950008')
        );
    `);
  },
};
