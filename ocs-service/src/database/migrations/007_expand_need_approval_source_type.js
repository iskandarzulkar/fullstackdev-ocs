module.exports = {
  up: async (request) => {
    await request.query(`
      IF COL_LENGTH('dbo.NeedApproval', 'SourceType') IS NOT NULL
      BEGIN
        ALTER TABLE NeedApproval ALTER COLUMN SourceType NVARCHAR(200) NULL;
      END
    `);
  },

  down: async (request) => {
    await request.query(`
      IF COL_LENGTH('dbo.NeedApproval', 'SourceType') IS NOT NULL
      BEGIN
        ALTER TABLE NeedApproval ALTER COLUMN SourceType NVARCHAR(50) NULL;
      END
    `);
  },
};
