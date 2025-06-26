const fs = require("fs/promises");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("./model");
const Response = require("../../utils/response");
const APIError = require("../../utils/errors");

const getMe = async (req, res) => {
  return new Response(req.user, "Kullanıcı bilgileri").success(res);
};

const updateMe = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const body = req.body;

    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    if (req.file) {
      body.avatar = `/uploads/${req.file.filename}`;

      const old = await User.findById(userId).select("avatar");
      if (old?.avatar) {
        const oldPath = path.join("public", old.avatar);
        fs.unlink(oldPath).catch(() => {});
      }
    }

    if (body.email) {
      const exists = await User.findOne({
        email: body.email,
        _id: { $ne: userId },
      });
      if (exists) throw new APIError("Bu e-posta zaten kayıtlı!", 400);
    }
    if (body.phone) {
      const exists = await User.findOne({
        phone: body.phone,
        _id: { $ne: userId },
      });
      if (exists) throw new APIError("Bu telefon zaten kayıtlı!", 400);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, body, {
      new: true,
      select: "-password -reset",
    });

    return new Response(updatedUser, "Kullanıcı güncellendi.").success(res);
  } catch (err) {
    next(err);
  }
};

const updateUserByAdmin = async (req, res) => {
  if (!req.user.is_admin) throw APIError.forbidden("Yetkisiz erişim.");

  const userId = req.params.id;
  const allowedFields = [
    "is_admin",
    "is_active",
    "is_mod",
    "salary",
    "commissionRate",
  ];

  const updates = {};
  for (const key of allowedFields) {
    if (key in req.body) {
      updates[key] = req.body[key];
    }
  }

  const updated = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    select: "-password -reset",
  });

  if (!updated) throw APIError.notFound("Kullanıcı bulunamadı.");
  return new Response(updated, "Kullanıcı bilgileri güncellendi.").success(res);
};

module.exports = { getMe, updateMe, updateUserByAdmin };
