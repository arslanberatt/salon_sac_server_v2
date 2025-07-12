const fs = require("fs/promises");
const path = require("path");
const bcrypt = require("bcryptjs");
const User = require("./model");
const Response = require("../../utils/response");
const APIError = require("../../utils/errors");

const getMe = async (req, res) => {
  return new Response(req.user, "Kullanıcı bilgileri").success(res);
};

const updateMe = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const body = { ...req.body };

    // ✅ Avatar güncelleme
    if (req.file) {
      body.avatar = `/uploads/${req.file.filename}`;

      const old = await User.findById(userId).select("avatar");
      if (old?.avatar && old.avatar !== "/uploads/default-avatar.png") {
        const oldPath = path.join("public", old.avatar);
        fs.unlink(oldPath).catch(() => { });
      }
    }

    // ✅ E-posta benzersizliği kontrolü
    if (body.email) {
      const exists = await User.findOne({
        email: body.email,
        _id: { $ne: userId },
      });
      if (exists) throw new APIError("Bu e-posta zaten kayıtlı!", 400);
    }

    // ✅ Telefon benzersizliği kontrolü
    if (body.phone) {
      const exists = await User.findOne({
        phone: body.phone,
        _id: { $ne: userId },
      });
      if (exists) throw new APIError("Bu telefon zaten kayıtlı!", 400);
    }

    // ✅ Şifre varsa hash'le
    if (body.password) {
      body.password = await bcrypt.hash(body.password.trim(), 10);
    }

    // ✅ Kullanıcıyı güncelle
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

const getActiveUsers = async (req, res, next) => {
  try {
    const users = await User.find({ is_active: true }).select(
      "-password -reset"
    );
    return new Response(users, "Aktif kullanıcılar listelendi").success(res);
  } catch (err) {
    next(err);
  }
};

const getPassiveUsers = async (req, res, next) => {
  try {
    const users = await User.find({ is_admin: false, is_active: false }).select(
      "-password -reset"
    );
    return new Response(users, "Pasif kullanıcılar listelendi").success(res);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMe,
  updateMe,
  updateUserByAdmin,
  getActiveUsers,
  getPassiveUsers,
};
