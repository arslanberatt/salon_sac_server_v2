const router = require("express").Router();
const { tokenCheck, adminCheck } = require("../../middlewares/auth");
const { addCategory, getCategories, updateCategory } = require("./controller");

router.post("/add-category", tokenCheck, adminCheck, addCategory);
router.get("/categories", tokenCheck, getCategories);
router.put("/update-category/:id", tokenCheck, adminCheck, updateCategory);

module.exports = router;
