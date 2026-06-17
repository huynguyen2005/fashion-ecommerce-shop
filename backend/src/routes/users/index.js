const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../middlewares/validate.middleware");
const { authentication } = require("../../middlewares/auth.middleware");
const { uploadAvatar } = require("../../middlewares/upload.middleware");
const { updateProfile, changePassword } = require("../../validations/user.validation");
const {
  getProfile: getProfileController,
  changePassword: changePasswordController,
  updateAvatar: updateAvatarController,
  updateProfile: updateProfileController,
} = require("../../controllers/user.controller");

const router = express.Router();

router.use(authentication);

router.get("/profile", asyncHandler(getProfileController));

router.patch("/profile", validate(updateProfile), asyncHandler(updateProfileController));

router.patch("/avatar", uploadAvatar, asyncHandler(updateAvatarController));

router.patch(
  "/change-password",
  validate(changePassword),
  asyncHandler(changePasswordController),
);

module.exports = router;
