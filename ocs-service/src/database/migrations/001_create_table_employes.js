module.exports = {
    up: async (request) => {
        await request.query(`
            IF NOT EXISTS (
                SELECT 1 FROM sys.tables WHERE name = 'Employee'
            )
            BEGIN
                CREATE TABLE Employee (
                Nik NVARCHAR(14) NOT NULL PRIMARY KEY,
                Name NVARCHAR(150) NOT NULL,
                Email NVARCHAR(150) NOT NULL,
                Position NVARCHAR(100) NOT NULL,

                Approver1_name NVARCHAR(150) NULL,
                Approver1_email NVARCHAR(150) NULL,
                Approver1_position NVARCHAR(100) NULL,

                Approver2_name NVARCHAR(150) NULL,
                Approver2_email NVARCHAR(150) NULL,
                Approver2_position NVARCHAR(100) NULL,

                created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
                updated_at DATETIME2 NULL,

                CONSTRAINT CK_Employee_Nik_14_Digit
                    CHECK (LEN(Nik) = 14 AND Nik NOT LIKE '%[^0-9]%')
                );
            END
        `);
    },

    down: async (request) => {
        await request.query(`
            IF OBJECT_ID('dbo.Employee', 'U') IS NOT NULL
            BEGIN
                DROP TABLE Employee;
            END
        `);
    },
};