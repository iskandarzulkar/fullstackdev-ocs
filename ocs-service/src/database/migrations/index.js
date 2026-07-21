const fs = require("fs");
const path = require("path");
const { sql, poolPromise } = require("../../config/database");

const command = process.argv[2] || "up";

const stepArg = process.argv.find((arg) => arg.startsWith("--step="));
const rollbackStep = stepArg ? Number(stepArg.replace("--step=", "")) : 1;

async function createMigrationTable(pool) {
  await pool.request().query(`
    IF NOT EXISTS (
      SELECT 1 FROM sys.tables WHERE name = 'migrations'
    )
    BEGIN
      CREATE TABLE migrations (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255) NOT NULL UNIQUE,
        executed_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
      );
    END
  `);
}

async function getExecutedMigrations(pool) {
  const result = await pool.request().query(`
    SELECT name FROM migrations ORDER BY id ASC
  `);

  return result.recordset.map((row) => row.name);
}

async function runInTransaction(pool, file, callback) {
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    const request = new sql.Request(transaction);

    await callback(request);

    await transaction.commit();
  } catch (error) {
    console.error(`Migration gagal: ${file}`);
    console.error("Error asli:");
    console.error(error.message);

    try {
      await transaction.rollback();
    } catch (rollbackError) {
      console.error("Rollback transaksi gagal:");
      console.error(rollbackError.message);
    }

    throw error;
  }
}

async function runUp(pool) {
  const executedMigrations = await getExecutedMigrations(pool);

  const files = fs
    .readdirSync(__dirname)
    .filter((file) => file.endsWith(".js"))
    .filter((file) => file !== "index.js")
    .sort();

  for (const file of files) {
    if (executedMigrations.includes(file)) {
      console.log(`Lewati migration: ${file}`);
      continue;
    }

    const migration = require(path.join(__dirname, file));

    if (typeof migration.up !== "function") {
      throw new Error(`Migration ${file} tidak memiliki fungsi up`);
    }

    await runInTransaction(pool, file, async (request) => {
      await migration.up(request, sql);

      await request
        .input("name", sql.NVarChar, file)
        .query("INSERT INTO migrations (name) VALUES (@name)");
    });

    console.log(`Migration berhasil: ${file}`);
  }
}

async function rollback(pool, step) {
  if (!Number.isInteger(step) || step < 1) {
    throw new Error("Nilai --step harus angka lebih dari 0");
  }

  const result = await pool
    .request()
    .input("step", sql.Int, step)
    .query(`
      SELECT TOP (@step) name
      FROM migrations
      ORDER BY id DESC
    `);

  if (result.recordset.length === 0) {
    console.log("Tidak ada migration untuk rollback");
    return;
  }

  for (const row of result.recordset) {
    const file = row.name;
    const migration = require(path.join(__dirname, file));

    if (typeof migration.down !== "function") {
      throw new Error(`Migration ${file} tidak memiliki fungsi down`);
    }

    await runInTransaction(pool, file, async (request) => {
      await migration.down(request, sql);

      await request
        .input("name", sql.NVarChar, file)
        .query("DELETE FROM migrations WHERE name = @name");
    });

    console.log(`Rollback berhasil: ${file}`);
  }
}

async function main() {
  try {
    const pool = await poolPromise;

    await createMigrationTable(pool);

    if (command === "up") {
      await runUp(pool);
    } else if (command === "rollback") {
      await rollback(pool, rollbackStep);
    } else {
      throw new Error("Command migration tidak dikenal. Gunakan: up atau rollback");
    }

    console.log("Proses migration selesai");
    process.exit(0);
  } catch (error) {
    console.error("Migration gagal");
    console.error(error.message);
    process.exit(1);
  }
}

main();