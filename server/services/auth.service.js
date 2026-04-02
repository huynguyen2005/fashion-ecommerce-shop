const bcrypt = require('bcrypt');
const { createKeyToken, findKeyTokenByUserId, updateKeyToken, deleteKeyToken } = require("../models/repositories/keyToken.repository");
const { findUserByEmail, createNewUser, findUserById, updateUserById } = require("../models/repositories/user.repository");
const { getInfoData } = require("../utils");
const { createTokenPair } = require("../utils/jwt");
const { ConflictError, UnauthorizedError, InternalServerError, NotFoundError } = require("../core/error.response");

class AuthService {

    static register = async ({ fullName, email, password }) => {
        const foundUser = await findUserByEmail(email);
        if (foundUser) {
            throw new ConflictError("Error: User already registered");
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await createNewUser({ fullName, email, password: hashPassword });

        if (!newUser) {
            throw new InternalServerError("Error: User registration failed");
        }

        const tokens = await createTokenPair({ userId: newUser._id, email });
        const keyToken = await createKeyToken({ userId: newUser._id, refreshToken: tokens.refreshToken });

        if (!keyToken) {
            throw new InternalServerError("Error: Key token creation failed");
        }

        return {
            user: getInfoData({ fields: ['_id', 'name', 'email'], object: newUser }),
            tokens
        };
    }

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
        const keyToken = await createKeyToken({ userId: foundUser._id, refreshToken: tokens.refreshToken });

        if (!keyToken) {
            throw new InternalServerError("Error: Key token creation failed");
        }

        return {
            user: getInfoData({ fields: ['_id', 'name', 'email'], object: foundUser }),
            tokens
        };
    }

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

        const updatedKeyToken = await updateKeyToken({ userId, refreshToken, newRefreshToken: newTokenPair.refreshToken });
        if (!updatedKeyToken) {
            throw new InternalServerError("Error: Key token update failed");
        }

        return newTokenPair;
    }

    static logout = async (userId) => {
        const deletedKeyToken = await deleteKeyToken(userId);

        if (!deletedKeyToken) {
            throw new InternalServerError("Error: Logout failed");
        }

        return true;
    }

    static socialRegistry = {
        google: {
            providerField: 'googleId',
            loginType: 'google'
        },
        facebook: {
            providerField: 'facebookId',
            loginType: 'facebook'
        }
    }

    static handleSocialAuth = async ({
        provider,
        providerId,
        email,
        fullName,
        avatar
    }) => {
        if (!provider || !providerId || !email) {
            throw new UnauthorizedError("Error: Invalid social account data");
        }

        const socialConfig = AuthService.socialRegistry[provider];

        if (!socialConfig) {
            throw new UnauthorizedError(`Error: Unsupported social provider: ${provider}`);
        }

        const { providerField, loginType } = socialConfig;

        let user = await findUserByEmail(email);

        if (!user) {
            const createData = {
                fullName: fullName || email.split('@')[0],
                email,

                avatar: avatar || null,
                loginType,
                [providerField]: providerId
            };

            user = await createNewUser(createData);

            if (!user) {
                throw new InternalServerError("Error: Social registration failed");
            }
        } else {
            const updateData = {};

            if (!user.avatar && avatar) {
                updateData.avatar = avatar;
            }

            if (!user[providerField]) {
                updateData[providerField] = providerId;
            }

            if (Object.keys(updateData).length > 0) {
                user = await updateUserById({
                    userId: user._id,
                    updateData
                });
                if (!user) {
                    throw new InternalServerError("Error: User update failed");
                }
            }
        }

        const tokens = await createTokenPair({
            userId: user._id,
            email: user.email
        });

        const newKeyToken = await createKeyToken({
            userId: user._id,
            refreshToken: tokens.refreshToken
        });

        if (!newKeyToken) {
            throw new InternalServerError("Error: Key token creation failed");
        }

        return {
            user: getInfoData({
                fields: ['_id', 'fullName', 'email'],
                object: user
            }),
            tokens
        };
    }
}

module.exports = AuthService;