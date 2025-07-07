const jwt = require("jsonwebtoken");
const APIError = require("../utils/errors");
const user = require("../app/users/model");

const createToken = async (user, res) => {
  const payload = {
    sub: user._id,
    name: user.name,
  };
  const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    algorithm: "HS512",
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return res.status(201).json({
    success: true,
    token,
    message: "Giriş başarılı!",
  });
};

const tokenCheck = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new APIError("Yetkisiz erişim. Lütfen oturum açın", 403);
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // otomatik throw

  const userInfo = await user
    .findById(decoded.sub)
    .select(
      "_id name lastname email phone is_admin salary commissionRate advanceBalance createdAt avatar"
    );

  if (!userInfo) {
    throw new APIError("Kullanıcı bulunamadı", 404);
  }

  req.user = userInfo;
  next();
};

const adminCheck = (req, res, next) => {
  if (!req.user.is_admin) {
    throw new APIError("Yetersiz yetki!", 403);
  }
  next();
};

const modCheck = (req, res, next) => {
  if (!req.user.is_mod) {
    throw new APIError("Yetersiz yetki!", 403);
  }
  next();
};

const createTemporaryToken = async (userId, email) => {
  const payload = {
    sub: userId,
    email: email,
  };

  const token = await jwt.sign(payload, process.env.JWT_TEMPORARY_SECRET_KEY, {
    algorithm: "HS512",
    expiresIn: process.env.JWT_TEMPORARY_EXPIRES_IN,
  });

  return "Bearer " + token;
};

const decodedTemporaryToken = async (temporaryToken) => {
  const tokenParts = temporaryToken.split(" ");

  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    throw new APIError("Token formatı hatalı!", 401);
  }

  const token = tokenParts[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_TEMPORARY_SECRET_KEY);
  } catch (err) {
    console.error("JWT Doğrulama Hatası:", err.message);
    throw new APIError("Geçersiz veya süresi dolmuş token!", 401);
  }

  const userData = await user
    .findById(decoded.sub)
    .select("_id name lastname email");

  if (!userData) {
    throw new APIError("Kullanıcı bulunamadı!", 404);
  }

  return userData;
};

module.exports = {
  createToken,
  tokenCheck,
  adminCheck,
  createTemporaryToken,
  decodedTemporaryToken,
  modCheck
};
