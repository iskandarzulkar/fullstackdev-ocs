module.exports = {
    up: async (request) => {
        await request.query(`
            IF NOT EXISTS (
                SELECT 1 FROM sys.tables WHERE name = 'WorkflowApproval'
            )
            BEGIN
                CREATE TABLE WorkflowApproval (
                id INT IDENTITY(1,1) PRIMARY KEY,
                Modul_id INT NOT NULL,
                Modul NVARCHAR(100) NOT NULL,
                [Type] NVARCHAR(50) NOT NULL,
                [Value] DECIMAL(18,2) NULL,
                [Level] INT NOT NULL,

                Nik NVARCHAR(14) NULL,
                Name NVARCHAR(150) NULL,
                Email NVARCHAR(150) NULL,
                Position NVARCHAR(100) NULL,

                created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
                updated_at DATETIME2 NULL,

                CONSTRAINT FK_WorkflowApproval_Modules
                    FOREIGN KEY (Modul_id) REFERENCES Modules(id),

                CONSTRAINT FK_WorkflowApproval_Employee_Nik
                    FOREIGN KEY (Nik) REFERENCES Employee(Nik),

                CONSTRAINT CK_WorkflowApproval_Type
                    CHECK ([Type] IN ('Custom', 'HRIS', 'Total Amount >=', 'Total Amount >', 'Total Amount <=', 'Total Amount <'))
                );
            END
        `);
    },

    down: async (request) => {
        await request.query(`
        IF OBJECT_ID('dbo.WorkflowApproval', 'U') IS NOT NULL
        BEGIN
            DROP TABLE WorkflowApproval;
        END
        `);
    },
};
