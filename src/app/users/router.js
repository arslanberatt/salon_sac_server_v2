const router = require("express").Router();
const upload = require("../../middlewares/lib/upload");
const { tokenCheck, adminCheck } = require("../../middlewares/auth");
const { getMe, updateMe, updateUserByAdmin } = require("./controller");

router.get("/me", tokenCheck, getMe);

router.put("/me", tokenCheck, upload.single("avatar"), updateMe);

router.put("/users/:id", tokenCheck,adminCheck, updateUserByAdmin);

module.exports = router;
