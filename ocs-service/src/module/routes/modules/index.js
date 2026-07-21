const router = require("express").Router();
const controller = require("../../controllers/modules");

router.get("/", controller.getAllModules);
router.get("/:id", controller.getModuleById);
router.post("/", controller.createModule);
router.put("/:id", controller.updateModule);
router.delete("/:id", controller.deleteModule);

module.exports = router;
