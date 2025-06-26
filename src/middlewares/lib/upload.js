const multer = require("multer");
const path = require("path");
const fs = require("fs");

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpg",
    "image/jpeg",
    "image/png",
    "image/gif",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new Error(
        "Bu resim tipi desteklenmemektedir. Lütfen farklı bir resim seçiniz!"
      ),
      false
    );
  }

  cb(null, true);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const rootDir = path.dirname(require.main.filename);
    const uploadPath = path.join(rootDir, "/public/uploads");

    // Dizin yoksa oluştur
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage, fileFilter });

module.exports = upload;
