module.exports = {
  up: async (request) => {
    await request.query(`
      CREATE OR ALTER PROCEDURE dbo.SubmitNeedApproval
        @Transaction_Id INT
      AS
      BEGIN
        SET NOCOUNT ON;

        DECLARE @Modul_id INT;
        DECLARE @Modul NVARCHAR(100);
        DECLARE @Amount DECIMAL(18, 2);
        DECLARE @CreatedBy NVARCHAR(14);

        SELECT
          @Modul_id = t.Modul_id,
          @Modul = m.Name,
          @Amount = t.Amount,
          @CreatedBy = t.createdBy
        FROM Transactions t
        INNER JOIN Modules m ON m.id = t.Modul_id
        WHERE t.id = @Transaction_Id;

        IF @Modul_id IS NULL
        BEGIN
          THROW 50001, 'Transaksi tidak ditemukan atau modul tidak valid', 1;
        END;

        DELETE FROM NeedApproval
        WHERE Transaction_Id = @Transaction_Id;

        INSERT INTO NeedApproval (
          Modul_id, Transaction_Id, Nik, Name, Email, Position, [Level], SourceType
        )
        SELECT
          @Modul_id,
          @Transaction_Id,
          wa.Nik,
          wa.Name,
          wa.Email,
          wa.Position,
          wa.[Level],
          wa.[Type]
        FROM WorkflowApproval wa
        WHERE wa.Modul_id = @Modul_id
          AND wa.Modul = @Modul
          AND (
            wa.[Type] = 'Custom'
            OR (wa.[Type] = 'Total Amount >=' AND @Amount >= wa.[Value])
            OR (wa.[Type] = 'Total Amount >' AND @Amount > wa.[Value])
            OR (wa.[Type] = 'Total Amount <=' AND @Amount <= wa.[Value])
            OR (wa.[Type] = 'Total Amount <' AND @Amount < wa.[Value])
          );

        INSERT INTO NeedApproval (
          Modul_id, Transaction_Id, Nik, Name, Email, Position, [Level], SourceType
        )
        SELECT
          @Modul_id,
          @Transaction_Id,
          approver.Nik,
          approver.Name,
          approver.Email,
          approver.Position,
          approver.[Level],
          'HRIS'
        FROM WorkflowApproval wa
        INNER JOIN Employee requester ON requester.Nik = @CreatedBy
        OUTER APPLY (
          SELECT TOP 1 Nik
          FROM Employee
          WHERE Email = requester.Approver1_email
        ) approver1
        OUTER APPLY (
          SELECT TOP 1 Nik
          FROM Employee
          WHERE Email = requester.Approver2_email
        ) approver2
        CROSS APPLY (
          VALUES
            (approver1.Nik, requester.Approver1_name, requester.Approver1_email, requester.Approver1_position, 1),
            (approver2.Nik, requester.Approver2_name, requester.Approver2_email, requester.Approver2_position, 2)
        ) approver(Nik, Name, Email, Position, [Level])
        WHERE wa.Modul_id = @Modul_id
          AND wa.Modul = @Modul
          AND wa.[Type] = 'HRIS'
          AND approver.Email IS NOT NULL
          AND approver.Email <> '';
      END
    `);
  },

  down: async (request) => {
    await request.query(`
      IF OBJECT_ID('dbo.SubmitNeedApproval', 'P') IS NOT NULL
      BEGIN
        DROP PROCEDURE dbo.SubmitNeedApproval;
      END
    `);
  },
};
