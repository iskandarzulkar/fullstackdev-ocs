module.exports = {
  seed: async (request) => {
    await request.query(`
      DECLARE @TransactionId INT;

      DECLARE transaction_cursor CURSOR LOCAL FAST_FORWARD FOR
        SELECT id
        FROM Transactions
        WHERE Modul_id = 1
          AND (
            (Amount = 7500000 AND createdBy = '74011306950001')
            OR (Amount = 12000000 AND createdBy = '74011306950008')
          )
        ORDER BY id ASC;

      OPEN transaction_cursor;
      FETCH NEXT FROM transaction_cursor INTO @TransactionId;

      WHILE @@FETCH_STATUS = 0
      BEGIN
        EXEC dbo.SubmitNeedApproval @Transaction_Id = @TransactionId;
        FETCH NEXT FROM transaction_cursor INTO @TransactionId;
      END

      CLOSE transaction_cursor;
      DEALLOCATE transaction_cursor;
    `);
  },

  down: async (request) => {
    await request.query(`
      DELETE FROM NeedApproval
      WHERE Transaction_Id IN (
        SELECT id
        FROM Transactions
        WHERE Modul_id = 1
          AND (
            (Amount = 7500000 AND createdBy = '74011306950001')
            OR (Amount = 12000000 AND createdBy = '74011306950008')
          )
      );
    `);
  },
};
