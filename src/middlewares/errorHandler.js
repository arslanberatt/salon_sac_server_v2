const APIError = require("../utils/errors");

const errorHandlerMiddleware = (err, req, res, next) => {
  console.error(err);

  let statusCode = err instanceof APIError
    ? err.statusCode 
    : typeof err.responseCode === "number"
      ? err.responseCode
      : 500;  

  if (!Number.isInteger(statusCode)) {
    statusCode = 500;
  }

  return res
    .status(statusCode)
    .json({ success: false, message: err.message || "Bilinmeyen bir hata oluştu!" });
};

module.exports = errorHandlerMiddleware;
