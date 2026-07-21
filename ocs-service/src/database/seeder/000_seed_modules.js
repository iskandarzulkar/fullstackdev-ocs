module.exports = {
  seed: async (request) => {
    await request.query(`
      INSERT INTO Modules (id, Name)
      SELECT data.id, data.Name
      FROM (VALUES
        (1, 'Transaction'),
        (2, 'Purchase Request'),
        (3, 'Reimbursement'),
        (4, 'Cash Advance'),
        (5, 'Leave Request')
      ) AS data (id, Name)
      WHERE NOT EXISTS (
        SELECT 1 FROM Modules WHERE Modules.id = data.id
      );
    `);
  },

  down: async (request) => {
    await request.query(`
      DELETE FROM Modules
      WHERE id IN (1, 2, 3, 4, 5);
    `);
  },
};
