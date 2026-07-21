const fs = require("fs");
const path = require("path");

const seederName = process.argv[2];

if (!seederName) {
  console.error("Nama seeder wajib diisi");
  console.error("Contoh: npm run make:seeder -- seed_modules");
  process.exit(1);
}

const seedersDir = path.join(__dirname, "seeder");

if (!fs.existsSync(seedersDir)) {
  fs.mkdirSync(seedersDir, { recursive: true });
}

function getNextNumber() {
  const files = fs
    .readdirSync(seedersDir)
    .filter((file) => /^\d+_.*\.js$/.test(file));

  if (files.length === 0) return "001";

  const lastNumber = files
    .map((file) => Number(file.split("_")[0]))
    .filter((number) => !Number.isNaN(number))
    .sort((a, b) => b - a)[0];

  return String(lastNumber + 1).padStart(3, "0");
}

const fileName = `${getNextNumber()}_${seederName}.js`;
const filePath = path.join(seedersDir, fileName);

const template = `module.exports = {
  seed: async (request) => {
    await request.query(\`
      -- Tulis query INSERT data di sini
      -- Contoh:
      -- IF NOT EXISTS (SELECT 1 FROM NamaTable WHERE id = 1)
      -- BEGIN
      --   INSERT INTO NamaTable (nama_kolom)
      --   VALUES ('nilai');
      -- END
    \`);
  },
};
`;

if (fs.existsSync(filePath)) {
  console.error(`Seeder sudah ada: ${fileName}`);
  process.exit(1);
}

fs.writeFileSync(filePath, template);

console.log(`Seeder berhasil dibuat: src/database/seeder/${fileName}`);