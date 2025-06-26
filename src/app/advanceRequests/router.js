const router = require("express").Router();
const { tokenCheck, adminCheck } = require("../../middlewares/auth");
const {
  createAdvanceRequest,
  getMyAdvanceRequests,
  getAllAdvanceRequests,
  updateAdvanceRequestStatus,
} = require("./controller");

router.post("/advance-request", tokenCheck, createAdvanceRequest);
router.get("/my-advance-requests", tokenCheck, getMyAdvanceRequests);
router.get(
  "/all-advance-requests",
  tokenCheck,
  adminCheck,
  getAllAdvanceRequests
);
router.put(
  "/advance-request/:id",
  tokenCheck,
  adminCheck,
  updateAdvanceRequestStatus
);

module.exports = router;
