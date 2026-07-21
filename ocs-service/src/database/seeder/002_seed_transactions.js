module.exports = {
  seed: async (request) => {
    await request.query(`
      IF NOT EXISTS (SELECT 1 FROM Transactions WHERE Modul_id = 1 AND Amount = 7500000 AND createdBy = '74011306950001')
      BEGIN
        INSERT INTO Transactions (Modul_id, Amount, createdBy)
        VALUES (1, 7500000, '74011306950001');
      END
    `);
  },

  down: async (request) => {
    await request.query(`
      DELETE FROM Transactions
      WHERE Modul_id = 1 AND createdBy = '74011306950001';
    `);
  },
};