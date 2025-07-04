const router = require("express").Router();
const { tokenCheck, adminCheck } = require("../../middlewares/auth");
const { addTransaction, cancelTransaction } = require("./controller");

router.get("/transactions", tokenCheck, adminCheck, getTransactions);
router.post("/add-transaction", tokenCheck, adminCheck, addTransaction);
router.put(
  "/transaction/cancel/:id",
  tokenCheck,
  adminCheck,
  cancelTransaction
);

module.exports = router;
