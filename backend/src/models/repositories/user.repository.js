const { getUnSelectData, getSelectData } = require("../../utils");
const userModel = require("../user.model");

const USER_PROFILE_SELECT_FIELDS = [
  "_id",
  "avatar",
  "fullName",
  "email",
  "phone",
  "address",
];

module.exports = {
  findUserByEmail: async (email) => {
    return await userModel
      .findOne({ email })
      .select(getUnSelectData(["createdAt", "updatedAt"]))
      .lean();
  },
  createNewUser: async ({ fullName, email, password }) => {
    return await userModel.create({ fullName, email, password });
  },
  findUserById: async (userId) => {
    return await userModel
      .findOne({ _id: userId, status: "active" })
      .select(getSelectData(["_id", "fullName", "email"]))
      .lean();
  },
  findUserProfileById: async (userId) => {
    return await userModel
      .findOne({ _id: userId, status: "active" })
      .select(getSelectData(USER_PROFILE_SELECT_FIELDS))
      .lean();
  },
  findUserAuthById: async (userId) => {
    return await userModel
      .findOne({ _id: userId, status: "active" })
      .select(getSelectData(["_id", "password"]))
      .lean();
  },
  updateUserPasswordById: async ({ userId, password }) => {
    return await userModel.findOneAndUpdate(
      { _id: userId, status: "active" },
      { password },
      { new: true },
    );
  },
  updateUserProfileById: async ({ userId, payload }) => {
    return await userModel
      .findOneAndUpdate(
        { _id: userId, status: "active" },
        { $set: payload },
        {
          new: true,
          runValidators: true,
        },
      )
      .select(getSelectData(USER_PROFILE_SELECT_FIELDS))
      .lean();
  },
  updateUserAvatarById: async ({ userId, avatar }) => {
    return await userModel
      .findOneAndUpdate(
        { _id: userId, status: "active" },
        { $set: { avatar } },
        {
          new: true,
          runValidators: true,
        },
      )
      .select(getSelectData(USER_PROFILE_SELECT_FIELDS))
      .lean();
  },
};
