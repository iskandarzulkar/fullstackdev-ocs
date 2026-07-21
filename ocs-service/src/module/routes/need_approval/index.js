const router = require("express").Router();
const controller = require("../../controllers/need_approval");

router.get("/", controller.getAllNeedApprovals);
router.get("/transaction/:transactionId", controller.getNeedApprovalsByTransactionId);
router.get("/:id", controller.getNeedApprovalById);
router.post("/", controller.createNeedApproval);
router.put("/:id", controller.updateNeedApproval);
router.delete("/:id", controller.deleteNeedApproval);

module.exports = router;