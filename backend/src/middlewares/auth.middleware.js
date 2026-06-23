const { findUserById } = require("../models/repositories/user.repository");
const { verifyAccessToken } = require("../helpers/jwt.helper");
const { BadRequestError, NotFoundError } = require("../core/error.response");

module.exports = {
    authentication: async (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return next(new BadRequestError('Error: No token provided'));
        }

        const payload = verifyAccessToken(token);
        const { userId } = payload;
        const foundUser = await findUserById(userId);
        if (!foundUser) {
            return next(new NotFoundError('Error: User not found or inactive'));
        }
        req.user = foundUser;
        next();
    }
};
