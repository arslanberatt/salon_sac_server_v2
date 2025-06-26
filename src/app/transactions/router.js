const router = require("express").Router();
const { tokenCheck, adminCheck } = require("../../middlewares/auth");
const { addTransaction, cancelTransaction } = require("./controller");

router.post("/transaction", tokenCheck, adminCheck, addTransaction);
router.patch(
  "/transaction/cancel/:id",
  tokenCheck,
  adminCheck,
  cancelTransaction
);

module.exports = router;
