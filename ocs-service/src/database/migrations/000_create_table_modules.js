module.exports = {
  up: async (request) => {
    await request.query(`
      IF NOT EXISTS (
        SELECT 1 FROM sys.tables WHERE name = 'Modules'
      )
      BEGIN
        CREATE TABLE Modules (
          id INT NOT NULL PRIMARY KEY,
          Name NVARCHAR(100) NOT NULL UNIQUE,
          created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
          updated_at DATETIME2 NULL
        );
      END
    `);
  },

  down: async (request) => {
    await request.query(`
      IF OBJECT_ID('dbo.Modules', 'U') IS NOT NULL
      BEGIN
        DROP TABLE Modules;
      END
    `);
  },
};
