const rateLimit = require("express-rate-limit");

app.set("trust proxy", 1);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: (req, res) => {
    if (req.url === "/login" || req.url === "/register") return 10;
    else return 100;
  },
  message: {
    succes: false,
    message: "Çok fazla istekte bulundunuz!",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
module.exports = apiLimiter;
