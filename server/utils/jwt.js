const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../core/error.response');

module.exports = {
    createTokenPair: async (payload) => {
        const accessToken = await jwt.sign(payload, process.env.JWT_SECRET, {
            algorithm: 'HS256',
            expiresIn: process.env.JWT_ACCESS_EXPIRES
        });

        const refreshToken = await jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            algorithm: 'HS256',
            expiresIn: process.env.JWT_REFRESH_EXPIRES
        });

        return { accessToken, refreshToken };
    },
    verifyAccessToken: (accessToken) => {
        try {
            const payload = jwt.verify(accessToken, process.env.JWT_SECRET);
            return payload;
        } catch (error) {
            throw new UnauthorizedError('Invalid or expired token');
        }
    },
    verifyRefreshToken: (refreshToken) => {
        try {
            const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            return payload;
        } catch (error) {
            throw new UnauthorizedError('Invalid or expired refresh token');
        } 
    }
};