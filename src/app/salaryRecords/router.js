const router = require("express").Router();
const { tokenCheck, adminCheck } = require("../../middlewares/auth");
const {
  getAllSalaryRecords,
  getMySalaryRecords,
} = require("./controller");

router.get("/my-salary-records", tokenCheck, getMySalaryRecords);

router.get("/salary-records", tokenCheck, adminCheck, getAllSalaryRecords);

module.exports = router;
