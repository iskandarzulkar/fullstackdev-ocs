const router = require("express").Router();
const controller = require("../../controllers/transactions");

router.get("/", controller.getAllTransactions);
router.get("/:id", controller.getTransactionById);
router.post("/", controller.createTransaction);
router.post("/:id/submit", controller.submitApproval);
router.put("/:id", controller.updateTransaction);
router.delete("/:id", controller.deleteTransaction);

module.exports = router;
