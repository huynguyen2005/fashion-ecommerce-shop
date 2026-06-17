const { OK } = require("../core/success.response");
const UserService = require("../services/user.service");

module.exports = {
  getProfile: async (req, res) => {
    new OK({
      message: "Profile retrieved successfully",
      metadata: await UserService.getProfile(req.user._id),
    }).send(res);
  },
  updateProfile: async (req, res) => {
    new OK({
      message: "Profile updated successfully",
      metadata: await UserService.updateProfile({
        userId: req.user._id,
        payload: req.body,
      }),
    }).send(res);
  },
  updateAvatar: async (req, res) => {
    new OK({
      message: "Avatar updated successfully",
      metadata: await UserService.updateAvatar({
        userId: req.user._id,
        file: req.file,
      }),
    }).send(res);
  },
  changePassword: async (req, res) => {
    new OK({
      message: "Password changed successfully",
      metadata: await UserService.changePassword({
        userId: req.user._id,
        ...req.body,
      }),
    }).send(res);
  },
};
