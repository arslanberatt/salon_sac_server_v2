const router = require("express").Router();
const { tokenCheck } = require("../../middlewares/auth");
const {
  createAppointment,
  getAppointments,
  markAsDone,
  cancelAppointment,
} = require("./controller");

router.post("/create-appointment", tokenCheck, createAppointment);
router.get("/appointments", tokenCheck, getAppointments);
router.put("/mark-as-done/:id", tokenCheck, markAsDone);
router.put("/cancel/:id", tokenCheck, cancelAppointment);
router.put("/update-appointment/:id", tokenCheck, updateAppointment);

module.exports = router;
