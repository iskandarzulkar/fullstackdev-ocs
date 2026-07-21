module.exports = {
  up: async (request) => {
    await request.query(`
      IF NOT EXISTS (
        SELECT 1 FROM sys.tables WHERE name = 'Transactions'
      )
      BEGIN
        CREATE TABLE Transactions (
          id INT IDENTITY(1,1) PRIMARY KEY,
          Modul_id INT NOT NULL,
          Amount DECIMAL(18,2) NOT NULL,
          createdBy NVARCHAR(14) NOT NULL,

          created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
          updated_at DATETIME2 NULL,

          CONSTRAINT FK_Transactions_Modules
            FOREIGN KEY (Modul_id) REFERENCES Modules(id),

          CONSTRAINT FK_Transactions_Employee_createdBy
            FOREIGN KEY (createdBy) REFERENCES Employee(Nik)
        );
      END
    `);
  },

  down: async (request) => {
    await request.query(`
      IF OBJECT_ID('dbo.Transactions', 'U') IS NOT NULL
      BEGIN
        DROP TABLE Transactions;
      END
    `);
  },
};
