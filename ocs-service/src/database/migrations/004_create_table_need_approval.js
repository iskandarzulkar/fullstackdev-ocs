module.exports = {
    up: async (request) => {
        await request.query(`
            IF NOT EXISTS (
                SELECT 1 FROM sys.tables WHERE name = 'NeedApproval'
            )
            BEGIN
                CREATE TABLE NeedApproval (
                id INT IDENTITY(1,1) PRIMARY KEY,
                Modul_id INT NOT NULL,
                Transaction_Id INT NOT NULL,

                Nik NVARCHAR(14) NOT NULL,
                Name NVARCHAR(150) NOT NULL,
                Email NVARCHAR(150) NOT NULL,
                Position NVARCHAR(100) NULL,

                [Level] INT NOT NULL,
                SourceType NVARCHAR(50) NULL,

                created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
                updated_at DATETIME2 NULL,

                CONSTRAINT FK_NeedApproval_Modules
                    FOREIGN KEY (Modul_id) REFERENCES Modules(id),

                CONSTRAINT FK_NeedApproval_Transactions
                    FOREIGN KEY (Transaction_Id) REFERENCES Transactions(id),

                CONSTRAINT FK_NeedApproval_Employee_Nik
                    FOREIGN KEY (Nik) REFERENCES Employee(Nik)
                );
            END
        `);
    },

    down: async (request) => {
        await request.query(`
            IF OBJECT_ID('dbo.NeedApproval', 'U') IS NOT NULL
            BEGIN
                DROP TABLE NeedApproval;
            END
        `);
    },
};
