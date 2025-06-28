const router = require("express").Router();
const { tokenCheck, adminCheck } = require("../../middlewares/auth");
const { getAllTransactions, addTransaction, cancelTransaction } = require("./controller");

router.get("/transactions", tokenCheck, adminCheck, getAllTransactions);
router.post("/add-transaction", tokenCheck, adminCheck, addTransaction);
router.patch(
  "/cancel-transaction/:id",
  tokenCheck,
  adminCheck,
  cancelTransaction
);

module.exports = router;
