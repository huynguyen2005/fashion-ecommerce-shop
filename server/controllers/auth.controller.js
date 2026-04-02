const { BadRequestError } = require("../core/error.response");
const { Created, OK } = require("../core/success.response");
const AuthService = require("../services/auth.service");
const { verifyRefreshToken } = require("../utils/jwt");


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
    googleCallback: async (req, res) => {
        new OK({
            message: "Google authentication successful",
            metadata: await AuthService.handleSocialAuth(req.user)
        }).send(res);
    },
    facebookCallback: async (req, res) => {
        new OK({
            message: "Facebook authentication successful",
            metadata: await AuthService.handleSocialAuth(req.user)
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
    }
};