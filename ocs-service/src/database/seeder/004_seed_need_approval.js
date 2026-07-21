module.exports = {
  seed: async (request) => {
    await request.query(`
      DECLARE @TransactionId INT;

      SELECT TOP 1 @TransactionId = id
      FROM Transactions
      WHERE Modul_id = 1 AND Amount = 7500000 AND createdBy = '74011306950001'
      ORDER BY id DESC;

      IF @TransactionId IS NOT NULL
      BEGIN
        EXEC dbo.SubmitNeedApproval @Transaction_Id = @TransactionId;
      END
    `);
  },

  down: async (request) => {
    await request.query(`
      DELETE FROM NeedApproval
      WHERE Nik IN ('74011306950002', '74011306950003', '74011306950004');
    `);
  },
};
