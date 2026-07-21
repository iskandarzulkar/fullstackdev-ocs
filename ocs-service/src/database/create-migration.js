const fs = require("fs");
const path = require("path");

const migrationName = process.argv[2];

if (!migrationName) {
  console.error("Nama migration wajib diisi");
  console.error("Contoh: npm run make:migration -- create_table_modules");
  process.exit(1);
}

const migrationsDir = path.join(__dirname, "migrations");

if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

function getNextNumber() {
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => /^\d+_.*\.js$/.test(file));

  if (files.length === 0) return "001";

  const lastNumber = files
    .map((file) => Number(file.split("_")[0]))
    .filter((number) => !Number.isNaN(number))
    .sort((a, b) => b - a)[0];

  return String(lastNumber + 1).padStart(3, "0");
}

function toPascalCase(value) {
  return value
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

const fileName = `${getNextNumber()}_${migrationName}.js`;

const tableName = migrationName.startsWith("create_table_")
  ? toPascalCase(migrationName.replace("create_table_", ""))
  : "NamaTable";

const filePath = path.join(migrationsDir, fileName);

const template = `module.exports = {
  up: async (request) => {
    await request.query(\`
      IF NOT EXISTS (
        SELECT 1 FROM sys.tables WHERE name = '${tableName}'
      )
      BEGIN
        CREATE TABLE ${tableName} (
          id INT IDENTITY(1,1) PRIMARY KEY,

          created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
          updated_at DATETIME2 NULL
        );
      END
    \`);
  },

  down: async (request) => {
    await request.query(\`
      IF OBJECT_ID('dbo.${tableName}', 'U') IS NOT NULL
      BEGIN
        DROP TABLE ${tableName};
      END
    \`);
  },
};
`;

if (fs.existsSync(filePath)) {
  console.error(`Migration sudah ada: ${fileName}`);
  process.exit(1);
}

fs.writeFileSync(filePath, template);

console.log(`Migration berhasil dibuat: src/database/migrations/${fileName}`);