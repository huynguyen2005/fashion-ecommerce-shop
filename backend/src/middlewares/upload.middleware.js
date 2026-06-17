const multer = require("multer");
const { BadRequestError } = require("../core/error.response");

const ALLOWED_AVATAR_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_AVATAR_FILE_SIZE = 5 * 1024 * 1024;

const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_AVATAR_FILE_SIZE,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_AVATAR_MIME_TYPES.includes(file.mimetype)) {
      return cb(new BadRequestError("Avatar must be jpg, jpeg, png, or webp"));
    }

    cb(null, true);
  },
});

const uploadAvatar = (req, res, next) => {
  avatarUpload.single("avatar")(req, res, (error) => {
    if (!error) return next();

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return next(new BadRequestError("Avatar size must not exceed 5MB"));
      }

      return next(new BadRequestError(error.message));
    }

    next(error);
  });
};

module.exports = {
  uploadAvatar,
};
