const express = require("express");
const app = express();
require("dotenv").config();
require("./src/db/dbConnection");
const router = require("./src/routers/index");
const port = process.env.PORT || 5000;
const errorHandlerMiddleware = require("./src/middlewares/errorHandler");
const cors = require("cors");
const corsOptions = require("./src/helpers/corsOptions");
const mongoSanitize = require("@exortek/express-mongo-sanitize");
const path = require("path");
const apiLimiter = require("./src/middlewares/rateLimit");
const moment = require("moment-timezone");
moment.tz.setDefault("Europe/Istanbul");

app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.set('trust proxy', 1);

app.use("/api", apiLimiter);

app.use((req, res, next) => {
  if (req.path.includes("/reset-password")) {
    return next();
  }
  mongoSanitize({ replaceWith: "_" })(req, res, next);
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(__dirname));

app.use(cors(corsOptions));
app.use("/api", router);

app.get("/", (req, res) => {
  res.json("Salon Saç Uygulamasına Hoş Geldiniz!");
});

app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor...`);
});
