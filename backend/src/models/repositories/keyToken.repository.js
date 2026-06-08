const keyTokenModel = require('../keyToken.model');

module.exports = {
    createKeyToken: async ({ userId, refreshToken }) => {
        const filter = { userId };
        const update = { refreshTokensUsed: [], refreshToken };
        const options = { upsert: true, new: true };
        const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);

        return tokens ? tokens.refreshToken : null;
    },
    findKeyTokenByUserId: async (userId) => {
        return await keyTokenModel.findOne({ userId }).lean();
    },
    updateKeyToken: async ({ userId, refreshToken, newRefreshToken }) => {
        return await keyTokenModel.findOneAndUpdate(
            { userId },
            {
                $set: {
                    refreshToken: newRefreshToken
                },
                $addToSet: {
                    refreshTokensUsed: refreshToken
                }
            },
            { new: true }
        );
    },
    deleteKeyToken: async (userId) => {
        return await keyTokenModel.deleteOne({ userId });
    }
};