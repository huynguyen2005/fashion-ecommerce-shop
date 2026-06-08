const bcrypt = require("bcrypt");
const {
  createKeyToken,
  findKeyTokenByUserId,
  updateKeyToken,
  deleteKeyToken,
} = require("../models/repositories/keyToken.repository");
const {
  findUserByEmail,
  createNewUser,
  findUserById,
  updateUserPasswordById,
} = require("../models/repositories/user.repository");
const { getInfoData, generateOTP } = require("../utils");
const { createTokenPair } = require("../helpers/jwt.helpers");
const MailService = require("./mail.service");
const OtpService = require("./otp.service");
const {
  ConflictError,
  UnauthorizedError,
  InternalServerError,
  NotFoundError,
} = require("../core/error.response");

class AuthService {
  static register = async ({ fullName, email, password }) => {
    const foundUser = await findUserByEmail(email);
    if (foundUser) {
      throw new ConflictError("Error: User already registered");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await createNewUser({
      fullName,
      email,
      password: hashPassword,
    });

    if (!newUser) {
      throw new InternalServerError("Error: User registration failed");
    }

    const tokens = await createTokenPair({ userId: newUser._id, email });
    const keyToken = await createKeyToken({
      userId: newUser._id,
      refreshToken: tokens.refreshToken,
    });

    if (!keyToken) {
      throw new InternalServerError("Error: Key token creation failed");
    }

    return {
      user: getInfoData({
        fields: ["_id", "fullName", "email"],
        object: newUser,
      }),
      tokens,
    };
  };

  static login = async ({ email, password }) => {
    const foundUser = await findUserByEmail(email);
    if (!foundUser) {
      throw new UnauthorizedError("Error: User not found");
    }

    const matchPassword = await bcrypt.compare(password, foundUser.password);
    if (!matchPassword) {
      throw new UnauthorizedError("Error: Incorrect password");
    }

    const tokens = await createTokenPair({ userId: foundUser._id, email });
    const keyToken = await createKeyToken({
      userId: foundUser._id,
      refreshToken: tokens.refreshToken,
    });

    if (!keyToken) {
      throw new InternalServerError("Error: Key token creation failed");
    }

    return {
      user: getInfoData({
        fields: ["_id", "fullName", "email"],
        object: foundUser,
      }),
      tokens,
    };
  };

  static handlerRefreshToken = async ({ refreshToken, user }) => {
    const { userId, email } = user;

    const foundUser = await findUserById(userId);
    if (!foundUser) {
      throw new UnauthorizedError("Error: User not found or inactive");
    }

    const foundKeyToken = await findKeyTokenByUserId(userId);
    if (!foundKeyToken) {
      throw new NotFoundError("Error: Key token not found");
    }

    if (foundKeyToken.refreshTokensUsed.includes(refreshToken)) {
      throw new UnauthorizedError("Error: Refresh token has been used");
    }

    if (refreshToken !== foundKeyToken.refreshToken) {
      throw new UnauthorizedError("Error: Invalid refresh token");
    }

    const newTokenPair = await createTokenPair({ userId, email });

    const updatedKeyToken = await updateKeyToken({
      userId,
      refreshToken,
      newRefreshToken: newTokenPair.refreshToken,
    });
    if (!updatedKeyToken) {
      throw new InternalServerError("Error: Key token update failed");
    }

    return newTokenPair;
  };

  static logout = async (userId) => {
    const deletedKeyToken = await deleteKeyToken(userId);

    if (!deletedKeyToken) {
      throw new InternalServerError("Error: Logout failed");
    }

    return true;
  };

  static forgotPassword = async ({ email }) => {
    const foundUser = await findUserByEmail(email);
    if (!foundUser) {
      throw new NotFoundError("Error: Email does not exist");
    }

    const otp = generateOTP();

    await OtpService.saveForgotPasswordOtp({ email, otp });
    await MailService.sendForgotPasswordOtp({
      email,
      fullName: foundUser.fullName,
      otp,
    });

    return {
      message: "OTP has been sent to the registered email",
      expiresIn: 180,
    };
  };

  static verifyForgotPasswordOtp = async ({ email, otp }) => {
    const foundUser = await findUserByEmail(email);
    if (!foundUser) throw new NotFoundError("Error: User not found");

    return await OtpService.verifyForgotPasswordOtp({ email, otp });
  };

  static resetPassword = async ({ email, resetToken, newPassword }) => {
    const foundUser = await findUserByEmail(email);
    if (!foundUser) throw new NotFoundError("Error: User not found");

    await OtpService.verifyResetToken({ email, resetToken });

    const hashPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await updateUserPasswordById({
      userId: foundUser._id,
      password: hashPassword,
    });

    if (!updatedUser) {
      throw new InternalServerError("Error: Reset password failed");
    }

    await OtpService.clearResetToken(email);

    return true;
  };
}
module.exports = AuthService;
