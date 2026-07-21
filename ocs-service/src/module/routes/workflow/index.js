const router = require("express").Router();
const controller = require("../../controllers/workflow");

router.get("/", controller.getAllWorkflowApprovals);
router.get("/:id", controller.getWorkflowApprovalById);
router.post("/", controller.createWorkflowApproval);
router.put("/:id", controller.updateWorkflowApproval);
router.delete("/:id", controller.deleteWorkflowApproval);

module.exports = router;