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
router.patch("/mark-as-done/:id", tokenCheck, markAsDone);
router.patch("/cancel/:id", tokenCheck, cancelAppointment);

module.exports = router;
