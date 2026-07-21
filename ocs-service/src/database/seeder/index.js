const fs = require("fs");
const path = require("path");
const { sql, poolPromise } = require("../../config/database");

const command = process.argv[2] || "up";
const stepArg = process.argv.find((arg) => arg.startsWith("--step="));
const rollbackStep = stepArg ? Number(stepArg.replace("--step=", "")) : 1;

async function createSeederTable(pool) {
  await pool.request().query(`
    IF NOT EXISTS (
      SELECT 1 FROM sys.tables WHERE name = 'seeders'
    )
    BEGIN
      CREATE TABLE seeders (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255) NOT NULL UNIQUE,
        executed_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
      );
    END
  `);
}

async function getExecutedSeeders(pool) {
  const result = await pool.request().query(`
    SELECT name FROM seeders ORDER BY id ASC
  `);

  return result.recordset.map((row) => row.name);
}

async function runInTransaction(pool, file, callback) {
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();
    await callback(transaction);
    await transaction.commit();
  } catch (error) {
    console.error(`Seeder gagal: ${file}`);
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
  const executedSeeders = await getExecutedSeeders(pool);

  const files = fs
    .readdirSync(__dirname)
    .filter((file) => file.endsWith(".js"))
    .filter((file) => file !== "index.js")
    .sort();

  for (const file of files) {
    if (executedSeeders.includes(file)) {
      console.log(`Lewati seeder: ${file}`);
      continue;
    }

    const seeder = require(path.join(__dirname, file));

    if (typeof seeder.seed !== "function") {
      throw new Error(`Seeder ${file} tidak memiliki fungsi seed`);
    }

    await runInTransaction(pool, file, async (transaction) => {
      await seeder.seed(new sql.Request(transaction), sql);

      await new sql.Request(transaction)
        .input("name", sql.NVarChar, file)
        .query("INSERT INTO seeders (name) VALUES (@name)");
    });

    console.log(`Seeder berhasil: ${file}`);
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
      FROM seeders
      ORDER BY id DESC
    `);

  if (result.recordset.length === 0) {
    console.log("Tidak ada seeder untuk rollback");
    return;
  }

  for (const row of result.recordset) {
    const file = row.name;
    const seeder = require(path.join(__dirname, file));

    if (typeof seeder.down !== "function") {
      throw new Error(`Seeder ${file} tidak memiliki fungsi down`);
    }

    await runInTransaction(pool, file, async (transaction) => {
      await seeder.down(new sql.Request(transaction), sql);

      await new sql.Request(transaction)
        .input("name", sql.NVarChar, file)
        .query("DELETE FROM seeders WHERE name = @name");
    });

    console.log(`Rollback seeder berhasil: ${file}`);
  }
}

async function main() {
  try {
    const pool = await poolPromise;

    await createSeederTable(pool);

    if (command === "up") {
      await runUp(pool);
    } else if (command === "rollback") {
      await rollback(pool, rollbackStep);
    } else {
      throw new Error("Command seeder tidak dikenal. Gunakan: up atau rollback");
    }

    console.log("Proses seeder selesai");
    process.exit(0);
  } catch (error) {
    console.error("Seeder gagal");
    console.error(error.message);
    process.exit(1);
  }
}

main();