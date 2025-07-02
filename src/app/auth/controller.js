const user = require("../users/model");
const bcrypt = require("bcrypt");
const APIError = require("../../utils/errors");
const Response = require("../../utils/response");
const {
  createToken,
  createTemporaryToken,
  decodedTemporaryToken,
} = require("../../middlewares/auth");
const sendEmail = require("../../utils/sendMail");
const crypto = require("crypto");
const moment = require("moment");

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("📥 Giriş denemesi:", { email, password });

  const userData = await user.findOne({ email });
  if (!userData) {
    console.log("❌ Kullanıcı bulunamadı:", email);
    throw new APIError("Böyle bir kullanıcı bulunamadı!", 400);
  }

  console.log("🔐 DB'deki hash:", userData.password);
  console.log("🔑 Gelen şifre:", password);

  const isPasswordValid = await bcrypt.compare(
    password.trim(),
    userData.password
  );
  console.log("⚖️ Eşleşme sonucu:", isPasswordValid);

  if (!isPasswordValid) {
    throw new APIError("Parola yanlış!", 400);
  }

  if (!userData.is_active) {
    console.log("🚫 Kullanıcı aktif değil.");
    throw new APIError("Kullanıcı aktif değil!", 403);
  }

  console.log("✅ Giriş başarılı:", email);
  createToken(userData, res);
};

const register = async (req, res) => {
  const { email, phone } = req.body;
  const userCheck = await user.findOne({ email });
  const phoneCheck = await user.findOne({ phone });
  if (userCheck) {
    throw new APIError("Bu e-posta adresi zaten kayıtlı!", 400);
  }
  if (phoneCheck) {
    throw new APIError("Bu telefon numarası zaten kayıtlı!", 400);
  }
  req.body.password = await bcrypt.hash(req.body.password, 10);

  const newUser = new user(req.body);

  await newUser
    .save()
    .then((data) => {
      return new Response(data, "Kayıt başarılı.").created(res);
    })
    .catch((err) => {
      console.error("Kullanıcı kaydı sırasında hata:", err);
    });
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  const userData = await user.findOne({ email });
  if (!userData) {
    throw new APIError("Böyle bir kullanıcı bulunamadı!", 400);
  }
  const resetCode = crypto.randomBytes(3).toString("hex");
  await sendEmail({
    to: userData.email,
    subject: "🔒 Şifre Sıfırlama Kodu",
    text: `Şifre sıfırlama kodunuz: ${resetCode}`,
    html: `
  <!DOCTYPE html>
  <html lang="tr">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Şifre Sıfırlama</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:20px 0;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background-color:#007BFF; padding:20px; text-align:center;">
                  <h1 style="color:#ffffff; font-size:24px; margin:0;">Şifre Sıfırlama</h1>
                </td>
              </tr>
              
              <!-- Body -->
              <tr>
                <td style="padding:30px;">
                  <p style="font-size:16px; color:#333333; line-height:1.5; margin:0 0 20px;">
                    Merhaba,
                  </p>
                  <p style="font-size:14px; color:#555555; line-height:1.5; margin:0 0 30px;">
                    Şifre sıfırlama isteği aldık. Aşağıdaki kodu 15 dakika içinde ilgili alana girerek yeni bir şifre belirleyebilirsiniz.
                  </p>
                  
                  <!-- Kod Blok -->
                  <div style="text-align:center; margin:0 0 30px;">
                    <span style="
                      display:inline-block;
                      font-size:32px;
                      font-weight:bold;
                      background-color:#F0F0F0;
                      padding:15px 25px;
                      border-radius:6px;
                      letter-spacing:4px;
                      color:#007BFF;
                    ">
                      ${resetCode}
                    </span>
                  </div>
                  
                  <!-- Button -->
                  <div style="text-align:center; margin-bottom:30px;">
                    <a href="#" style="
                      text-decoration:none;
                      display:inline-block;
                      background-color:#007BFF;
                      color:#ffffff;
                      padding:12px 30px;
                      border-radius:6px;
                      font-size:16px;
                    ">Kodu Kopyala</a>
                  </div>
                  
                  <p style="font-size:12px; color:#777777; line-height:1.4; margin:0;">
                    Bu isteği siz yapmadıysanız lütfen bu e-postayı görmezden gelin veya bizimle iletişime geçin.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color:#F9F9F9; padding:20px; text-align:center;">
                  <p style="font-size:12px; color:#999999; margin:0;">
                    © 2025 Şirketiniz. Tüm hakları saklıdır.
                  </p>
                </td>
              </tr>
            
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `,
  });

  await user.updateOne(
    { email },
    {
      reset: {
        code: resetCode,
        time: moment(new Date())
          .add(15, "minutes")
          .format("YYYY-MM-DD HH:mm:ss"),
      },
    }
  );

  return new Response(
    true,
    "Şifre sıfırlama kodu e-posta adresinize gönderildi."
  ).success(res);
};

const resetCodeCheck = async (req, res) => {
  const { email, code } = req.body;
  const userData = await user
    .findOne({ email })
    .select("_id name lastname email reset");
  if (!userData) {
    throw new APIError("Geçersiz kod!", 401);
  }
  const dbTime = moment(userData.reset.time);
  const currentTime = moment(new Date());

  const timeDiff = dbTime.diff(currentTime, "minutes");
  if (timeDiff <= 0 || userData.reset.code !== code) {
    throw new APIError("Geçersiz kod!", 401);
  }
  const temporaryToken = await createTemporaryToken(
    userData._id,
    userData.email
  );
  return new Response(
    { temporaryToken, user: userData },
    "Şifre sıfırlama kodu doğrulandı."
  ).success(res);
};

const resetPassword = async (req, res) => {
  const { password, temporaryToken } = req.body;
  const decodedToken = await decodedTemporaryToken(temporaryToken);
  if (!decodedToken) {
    throw new APIError("Geçersiz token!", 401);
  }
  const hashedPassword = await bcrypt.hash(password.trim(), 10);
  console.log("✅ Yeni hash (noktalı şifre için):", hashedPassword);
  await user.updateOne(
    { _id: decodedToken._id },
    {
      reset: {
        code: null,
        time: null,
      },
      password: hashedPassword,
    }
  );
  return new Response(
    decodedToken,
    "Şifreniz başarıyla sıfırlandı. Lütfen giriş yapın."
  ).success(res);
};

module.exports = {
  login,
  register,
  forgetPassword,
  resetCodeCheck,
  resetPassword,
};
