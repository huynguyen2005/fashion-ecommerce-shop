const { BadRequestError } = require("../core/error.response");
const { Created, OK } = require("../core/success.response");
const AuthService = require("../services/auth.service");
const { verifyRefreshToken } = require("../helpers/jwt.helpers");


module.exports = {
    signUp: async (req, res) => {
        new Created({
            message: "User registration successful",
            metadata: await AuthService.register(req.body)
        }).send(res);
    },
    signIn: async (req, res) => {
        new OK({
            message: "User login successful",
            metadata: await AuthService.login(req.body)
        }).send(res);
    },
    handlerRefreshToken: async (req, res) => {
        const refreshToken = req.body.refreshToken;
        if(!refreshToken)   throw new BadRequestError("Refresh token is required");
        
        const payload = await verifyRefreshToken(refreshToken);

        new OK({
            message: "Token refresh successful",
            metadata: await AuthService.handlerRefreshToken({ refreshToken: req.body.refreshToken, user: payload })
        }).send(res);
    },
    logout: async (req, res) => {
        const userId = req.user._id;
        new OK({
            message: "Logout successful",
            metadata: await AuthService.logout(userId)
        }).send(res);
    },
    forgotPassword: async (req, res) => {
        new OK({
            message: "Forgot password request successful",
            metadata: await AuthService.forgotPassword(req.body)
        }).send(res);
    },
    verifyForgotPasswordOtp: async (req, res) => {
        new OK({
            message: "OTP verified successfully",
            metadata: await AuthService.verifyForgotPasswordOtp(req.body)
        }).send(res);
    },
    resetPassword: async (req, res) => {
        new OK({
            message: "Password reset successful",
            metadata: await AuthService.resetPassword(req.body)
        }).send(res);
    }
};
