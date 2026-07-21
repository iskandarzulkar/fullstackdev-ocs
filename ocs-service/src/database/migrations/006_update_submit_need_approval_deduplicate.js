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

        DECLARE @CandidateApprovals TABLE (
          Nik NVARCHAR(14) NOT NULL,
          Name NVARCHAR(150) NOT NULL,
          Email NVARCHAR(150) NOT NULL,
          Position NVARCHAR(100) NULL,
          [Level] INT NOT NULL,
          SourceType NVARCHAR(200) NOT NULL
        );

        INSERT INTO @CandidateApprovals (
          Nik, Name, Email, Position, [Level], SourceType
        )
        SELECT
          wa.Nik,
          wa.Name,
          wa.Email,
          wa.Position,
          wa.[Level],
          wa.[Type]
        FROM WorkflowApproval wa
        WHERE wa.Modul_id = @Modul_id
          AND wa.Modul = @Modul
          AND wa.Nik IS NOT NULL
          AND (
            wa.[Type] = 'Custom'
            OR (wa.[Type] = 'Total Amount >=' AND @Amount >= wa.[Value])
            OR (wa.[Type] = 'Total Amount >' AND @Amount > wa.[Value])
            OR (wa.[Type] = 'Total Amount <=' AND @Amount <= wa.[Value])
            OR (wa.[Type] = 'Total Amount <' AND @Amount < wa.[Value])
          );

        INSERT INTO @CandidateApprovals (
          Nik, Name, Email, Position, [Level], SourceType
        )
        SELECT
          approver.Nik,
          approver.Name,
          approver.Email,
          approver.Position,
          wa.[Level] + approver.SequenceNo - 1,
          'HRIS'
        FROM WorkflowApproval wa
        INNER JOIN Employee requester ON requester.Nik = @CreatedBy
        OUTER APPLY (
          SELECT TOP 1 Nik, Name, Email, Position
          FROM Employee
          WHERE Email = requester.Approver1_email
        ) approver1
        OUTER APPLY (
          SELECT TOP 1 Nik, Name, Email, Position
          FROM Employee
          WHERE Email = requester.Approver2_email
        ) approver2
        CROSS APPLY (
          VALUES
            (approver1.Nik, approver1.Name, approver1.Email, approver1.Position, 1),
            (approver2.Nik, approver2.Name, approver2.Email, approver2.Position, 2)
        ) approver(Nik, Name, Email, Position, SequenceNo)
        WHERE wa.Modul_id = @Modul_id
          AND wa.Modul = @Modul
          AND wa.[Type] = 'HRIS'
          AND approver.Nik IS NOT NULL;

        INSERT INTO NeedApproval (
          Modul_id, Transaction_Id, Nik, Name, Email, Position, [Level], SourceType
        )
        SELECT
          @Modul_id,
          @Transaction_Id,
          grouped.Nik,
          grouped.Name,
          grouped.Email,
          grouped.Position,
          grouped.[Level],
          grouped.SourceType
        FROM (
          SELECT
            candidate.Nik,
            MAX(candidate.Name) AS Name,
            MAX(candidate.Email) AS Email,
            MAX(candidate.Position) AS Position,
            MIN(candidate.[Level]) AS [Level],
            STUFF((
              SELECT DISTINCT ', ' + source.SourceType
              FROM @CandidateApprovals source
              WHERE source.Nik = candidate.Nik
              FOR XML PATH(''), TYPE
            ).value('.', 'NVARCHAR(MAX)'), 1, 2, '') AS SourceType
          FROM @CandidateApprovals candidate
          GROUP BY candidate.Nik
        ) grouped
        ORDER BY grouped.[Level] ASC, grouped.Name ASC;
      END
    `);
  },

  down: async (request) => {
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
};
