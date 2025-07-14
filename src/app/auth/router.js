const router = require("express").Router();
const {
  login,
  register,
  forgetPassword,
  resetCodeCheck,
  resetPassword,
} = require("./controller");
const { tokenCheck } = require("../../middlewares/auth");
const authValidation = require("../../middlewares/validations/authValidation");
router.post("/login", authValidation.login, login);
router.post("/register", authValidation.register, register);
router.post("/forget-password", forgetPassword);
router.post("/reset-code-check", resetCodeCheck);
router.post("/reset-password", resetPassword);
router.delete("/delete-me", tokenCheck, deleteMe);

module.exports = router;





























