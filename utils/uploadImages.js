const appRoot = require("app-root-path");
const path = require("path");
const multer = require("multer");

const imageFilter = (req, file, cb) => {
  // accept image only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("CHECK APP_ROOT: ", appRoot);
    cb(null, appRoot + "/public/images/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname.trim());
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
const uploadMultipleImageFiles = multer({
  storage: storage,
  fileFilter: imageFilter,
}).array("multiple_images", 5);

module.exports = uploadMultipleImageFiles;
