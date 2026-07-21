const router = require("express").Router();
const controller = require("../../controllers/employee");

router.get("/", controller.getAllEmployees);
router.get("/:nik", controller.getEmployeeByNik);
router.post("/", controller.createEmployee);
router.put("/:nik", controller.updateEmployee);
router.delete("/:nik", controller.deleteEmployee);

module.exports = router;