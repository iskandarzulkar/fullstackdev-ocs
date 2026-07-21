export const approvalTypes = [
  "Custom",
  "HRIS",
  "Total Amount >=",
  "Total Amount >",
  "Total Amount <=",
  "Total Amount <",
];

export const emptyEmployee = {
  Nik: "",
  Name: "",
  Email: "",
  Position: "",
  Approver1_name: "",
  Approver1_email: "",
  Approver1_position: "",
  Approver2_name: "",
  Approver2_email: "",
  Approver2_position: "",
};

export const emptyWorkflow = {
  id: null,
  Modul_id: 1,
  Type: "Custom",
  Value: 0,
  Level: 1,
  Nik: "",
};

export const emptyModule = {
  id: "",
  Name: "",
};

export const emptyTransaction = {
  Modul_id: 1,
  Amount: 7500000,
  createdBy: "",
};
