const bcrypt = require("bcrypt");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../core/error.response");
const {
  findUserAuthById,
  findUserProfileById,
  updateUserAvatarById,
  updateUserProfileById,
  updateUserPasswordById,
} = require("../models/repositories/user.repository");
const CloudinaryService = require("./cloudinary.service");

class UserService {
  static getProfile = async (userId) => {
    const foundUser = await findUserProfileById(userId);

    if (!foundUser) {
      throw new NotFoundError("Error: User not found or blocked");
    }

    return foundUser;
  };

  static updateProfile = async ({ userId, payload }) => {
    const updatedUser = await updateUserProfileById({
      userId,
      payload,
    });

    if (!updatedUser) {
      throw new NotFoundError("Error: User not found or blocked");
    }

    return updatedUser;
  };

  static updateAvatar = async ({ userId, file }) => {
    if (!file) {
      throw new BadRequestError("Error: Avatar file is required");
    }

    const uploadResult = await CloudinaryService.uploadAvatar(file.buffer);
    const updatedUser = await updateUserAvatarById({
      userId,
      avatar: uploadResult.secure_url,
    });

    if (!updatedUser) {
      throw new NotFoundError("Error: User not found or blocked");
    }

    return updatedUser;
  };

  static changePassword = async ({ userId, oldPassword, newPassword }) => {
    const foundUser = await findUserAuthById(userId);

    if (!foundUser) {
      throw new NotFoundError("Error: User not found or blocked");
    }

    const isCorrectPassword = await bcrypt.compare(
      oldPassword,
      foundUser.password,
    );
    if (!isCorrectPassword) {
      throw new UnauthorizedError("Error: Current password is incorrect");
    }

    const isSamePassword = await bcrypt.compare(newPassword, foundUser.password);
    if (isSamePassword) {
      throw new BadRequestError(
        "Error: New password must be different from current password",
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await updateUserPasswordById({
      userId,
      password: hashedPassword,
    });

    if (!updatedUser) {
      throw new NotFoundError("Error: User not found or blocked");
    }

    return true;
  };
}

module.exports = UserService;
