const joi = require("joi");
const APIError = require("../../utils/errors");

class AuthValidation {
  constructor() {}
  static register = async (req, res, next) => {
    try {
      await joi
        .object({
          name: joi.string().min(3).max(20).required().messages({
            "string.min": "Ad en az 3 karakter olmalıdır.",
            "string.max": "Ad en fazla 20 karakter olmalıdır.",
            "any.required": "Ad alanı zorunludur.",
          }),
          lastname: joi.string().min(3).max(20).required().messages({
            "string.min": "Soyad en az 3 karakter olmalıdır.",
            "string.max": "Soyad en fazla 20 karakter olmalıdır.",
            "any.required": "Soyad alanı zorunludur.",
          }),
          phone: joi.string().length(10).required().messages({
            "string.length": "Telefon numarası 10 karakter olmalıdır.",
            "any.required": "Telefon alanı zorunludur.",
          }),
          email: joi.string().email().required().messages({
            "string.email": "Geçerli bir e-posta adresi girin.",
            "any.required": "E-posta alanı zorunludur.",
          }),
          password: joi.string().min(6).max(20).required().messages({
            "string.min": "Parola en az 6 karakter olmalıdır.",
            "string.max": "Parola en fazla 20 karakter olmalıdır.",
            "any.required": "Parola alanı zorunludur.",
          }),
        })
        .validateAsync(req.body);
    } catch (err) {
      throw new APIError(err.message, 400);
    }
    next();
  };

  static login = async (req, res, next) => {
    try {
      await joi
        .object({
          email: joi.string().email().required().messages({
            "string.email": "Geçerli bir e-posta adresi girin.",
            "any.required": "E-posta alanı zorunludur.",
          }),
          password: joi.string().min(6).max(20).required().messages({
            "string.min": "Parola en az 6 karakter olmalıdır.",
            "string.max": "Parola en fazla 20 karakter olmalıdır.",
            "any.required": "Parola alanı zorunludur.",
          }),
        })
        .validateAsync(req.body);
    } catch (err) {
      throw new APIError(err.message, 400);
    }
    next();
  };

}

module.exports = AuthValidation;
