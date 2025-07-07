const router = require("express").Router();
const {
  getAllServices,
  createService,
  updateService,
} = require("./controller");
const { tokenCheck, adminCheck } = require("../../middlewares/auth");

router.get("/services", tokenCheck, getAllServices);
router.post("/create-service", tokenCheck, adminCheck, createService);
router.put("/update-service/:id", tokenCheck, adminCheck, updateService);

module.exports = router;
