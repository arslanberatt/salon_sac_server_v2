const router = require("express").Router();
const { tokenCheck, adminCheck } = require("../../middlewares/auth");
const {
  getTransactions,
  addTransaction,
  cancelTransaction,
} = require("./controller");

router.get("/transactions", tokenCheck, adminCheck, getTransactions);
router.post("/add-transaction", tokenCheck, adminCheck, addTransaction);
router.put(
  "/cancel-transaction/:id",
  tokenCheck,
  adminCheck,
  cancelTransaction
);

module.exports = router;
