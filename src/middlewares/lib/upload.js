const multer = require("multer");
const path = require("path");
const fs = require("fs");

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = [".jpg", ".jpeg", ".png", ".gif"];

  if (!allowedExts.includes(ext)) {
    return cb(
      new Error(
        "Bu resim tipi desteklenmemektedir. Lütfen .jpg, .jpeg, .png veya .gif uzantılı bir resim seçiniz!"
      ),
      false
    );
  }

  cb(null, true);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const rootDir = path.dirname(require.main.filename);
    const uploadPath = path.join(rootDir, "public/uploads");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage, fileFilter });
module.exports = upload;
