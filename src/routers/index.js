const router = require("express").Router();
const upload = require("../middlewares/lib/upload");
const APIError = require("../utils/errors");
const Response = require("../utils/response");
const auth = require("../app/auth/router");
const user = require("../app/users/router");
const service = require("../app/services/router");
const appointment = require("../app/appointments/router");
const salaryRecord = require("../app/salaryRecords/router");
const advanceRequest = require("../app/advanceRequests/router");
const transactionCategory = require("../app/transactionCategories/router");
const transaction = require("../app/transactions/router");
router.use(auth);
router.use(user);
router.use(service);
router.use(appointment);
router.use(salaryRecord);
router.use(advanceRequest);
router.use(transactionCategory);
router.use(transaction);
const multer = require("multer");

router.post("/upload", (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return next(new APIError("Resim yüklenirken hata oluştu!", 500));
    }
    if (err) {
      return next(new APIError("Resim yüklenirken hata oluştu!", 500));
    }
    if (!req.file) {
      return next(new APIError("Yüklenen dosya bulunamadı.", 400));
    }
    return new Response(req.file, "Resim başarıyla yüklendi.").success(res);
  });
});
module.exports = router;
