const router = require("express").Router();
const upload = require("../../middlewares/lib/upload");
const { tokenCheck, adminCheck } = require("../../middlewares/auth");
const { getMe, updateMe, updateUserByAdmin, getActiveUsers, getPassiveUsers } = require("./controller");

router.get("/me", tokenCheck, getMe);
router.get("/active", tokenCheck, adminCheck, getActiveUsers);
router.get("/passive", tokenCheck, adminCheck, getPassiveUsers);
router.put("/update-user", tokenCheck, upload.single("avatar"), updateMe);
router.put("/users/:id", tokenCheck, adminCheck, updateUserByAdmin);

module.exports = router;
