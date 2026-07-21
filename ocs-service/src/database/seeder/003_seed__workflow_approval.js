module.exports = {
  seed: async (request) => {
    await request.query(`
      IF NOT EXISTS (SELECT 1 FROM WorkflowApproval WHERE Modul = 'Transaction' AND [Type] = 'Custom' AND Nik = '74011306950002')
        INSERT INTO WorkflowApproval (Modul_id, Modul, [Type], [Value], [Level], Nik, Name, Email, Position)
        VALUES (1, 'Transaction', 'Custom', 0, 1, '74011306950002', 'Siti Aminah', 'siti.aminah@xyz.co.id', 'Supervisor Finance');

      IF NOT EXISTS (SELECT 1 FROM WorkflowApproval WHERE Modul = 'Transaction' AND [Type] = 'HRIS')
        INSERT INTO WorkflowApproval (Modul_id, Modul, [Type], [Value], [Level], Nik, Name, Email, Position)
        VALUES (1, 'Transaction', 'HRIS', 0, 1, NULL, NULL, NULL, NULL);

      IF NOT EXISTS (SELECT 1 FROM WorkflowApproval WHERE Modul = 'Transaction' AND [Type] = 'Total Amount >=' AND Nik = '74011306950003')
        INSERT INTO WorkflowApproval (Modul_id, Modul, [Type], [Value], [Level], Nik, Name, Email, Position)
        VALUES (1, 'Transaction', 'Total Amount >=', 5000000, 2, '74011306950003', 'Andi Wijaya', 'andi.wijaya@xyz.co.id', 'Manager Finance');

      IF NOT EXISTS (SELECT 1 FROM WorkflowApproval WHERE Modul = 'Transaction' AND [Type] = 'Total Amount >' AND Nik = '74011306950004')
        INSERT INTO WorkflowApproval (Modul_id, Modul, [Type], [Value], [Level], Nik, Name, Email, Position)
        VALUES (1, 'Transaction', 'Total Amount >', 7000000, 3, '74011306950004', 'Rina Kurnia', 'rina.kurnia@xyz.co.id', 'Direktur Operasional');
    `);
  },

  down: async (request) => {
    await request.query(`
      DELETE FROM WorkflowApproval
      WHERE Modul = 'Transaction'
      AND Nik IN ('74011306950002', '74011306950003', '74011306950004');
    `);
  },
};
