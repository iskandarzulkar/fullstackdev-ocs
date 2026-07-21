module.exports = {
  seed: async (request) => {
    await request.query(`
      INSERT INTO Employee (
        Nik, Name, Email, Position,
        Approver1_name, Approver1_email, Approver1_position,
        Approver2_name, Approver2_email, Approver2_position
      )
      SELECT *
      FROM (VALUES
        ('74011306950001', 'Budi Santoso', 'budi.santoso@xyz.co.id', 'Staff Finance', 'Siti Aminah', 'siti.aminah@xyz.co.id', 'Supervisor Finance', 'Andi Wijaya', 'andi.wijaya@xyz.co.id', 'Manager Finance'),
        ('74011306950002', 'Siti Aminah', 'siti.aminah@xyz.co.id', 'Supervisor Finance', 'Andi Wijaya', 'andi.wijaya@xyz.co.id', 'Manager Finance', 'Rina Kurnia', 'rina.kurnia@xyz.co.id', 'Direktur Operasional'),
        ('74011306950003', 'Andi Wijaya', 'andi.wijaya@xyz.co.id', 'Manager Finance', 'Rina Kurnia', 'rina.kurnia@xyz.co.id', 'Direktur Operasional', NULL, NULL, NULL),
        ('74011306950004', 'Rina Kurnia', 'rina.kurnia@xyz.co.id', 'Direktur Operasional', NULL, NULL, NULL, NULL, NULL, NULL),
        ('74011306950005', 'Dewi Lestari', 'dewi.lestari@xyz.co.id', 'Staff HR', 'Hendra Saputra', 'hendra.saputra@xyz.co.id', 'Supervisor HR', 'Maya Putri', 'maya.putri@xyz.co.id', 'Manager HR'),
        ('74011306950006', 'Hendra Saputra', 'hendra.saputra@xyz.co.id', 'Supervisor HR', 'Maya Putri', 'maya.putri@xyz.co.id', 'Manager HR', 'Rina Kurnia', 'rina.kurnia@xyz.co.id', 'Direktur Operasional'),
        ('74011306950007', 'Maya Putri', 'maya.putri@xyz.co.id', 'Manager HR', 'Rina Kurnia', 'rina.kurnia@xyz.co.id', 'Direktur Operasional', NULL, NULL, NULL),
        ('74011306950008', 'Agus Pratama', 'agus.pratama@xyz.co.id', 'Staff IT', 'Nina Marlina', 'nina.marlina@xyz.co.id', 'Supervisor IT', 'Fajar Nugroho', 'fajar.nugroho@xyz.co.id', 'Manager IT'),
        ('74011306950009', 'Nina Marlina', 'nina.marlina@xyz.co.id', 'Supervisor IT', 'Fajar Nugroho', 'fajar.nugroho@xyz.co.id', 'Manager IT', 'Rina Kurnia', 'rina.kurnia@xyz.co.id', 'Direktur Operasional'),
        ('74011306950010', 'Fajar Nugroho', 'fajar.nugroho@xyz.co.id', 'Manager IT', 'Rina Kurnia', 'rina.kurnia@xyz.co.id', 'Direktur Operasional', NULL, NULL, NULL)
      ) AS data (
        Nik, Name, Email, Position,
        Approver1_name, Approver1_email, Approver1_position,
        Approver2_name, Approver2_email, Approver2_position
      )
      WHERE NOT EXISTS (
        SELECT 1 FROM Employee WHERE Employee.Nik = data.Nik
      );
    `);
  },

  down: async (request) => {
    await request.query(`
      DELETE FROM NeedApproval
      WHERE Nik IN (
        '74011306950001','74011306950002','74011306950003','74011306950004','74011306950005',
        '74011306950006','74011306950007','74011306950008','74011306950009','74011306950010'
      )
      OR Transaction_Id IN (
        SELECT id
        FROM Transactions
        WHERE createdBy IN (
          '74011306950001','74011306950002','74011306950003','74011306950004','74011306950005',
          '74011306950006','74011306950007','74011306950008','74011306950009','74011306950010'
        )
      );

      DELETE FROM Transactions
      WHERE createdBy IN (
        '74011306950001','74011306950002','74011306950003','74011306950004','74011306950005',
        '74011306950006','74011306950007','74011306950008','74011306950009','74011306950010'
      );

      DELETE FROM WorkflowApproval
      WHERE Nik IN (
        '74011306950001','74011306950002','74011306950003','74011306950004','74011306950005',
        '74011306950006','74011306950007','74011306950008','74011306950009','74011306950010'
      );

      DELETE FROM Employee
      WHERE Nik IN (
        '74011306950001','74011306950002','74011306950003','74011306950004','74011306950005',
        '74011306950006','74011306950007','74011306950008','74011306950009','74011306950010'
      );
    `);
  },
};
