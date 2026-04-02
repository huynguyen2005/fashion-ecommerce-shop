const { getUnSelectData, getSelectData } = require("../../utils");
const userModel = require("../user.model");

module.exports = {
    findUserByEmail: async (email) => {
        return await userModel.findOne({ email }).select(getUnSelectData(['createdAt', 'updatedAt'])).lean();
    },
    createNewUser: async ({ fullName, email, password = null, googleId = null, facebookId = null, loginType = 'local'}) => {
        return await userModel.create({ fullName, email, password, googleId, facebookId, loginType });
    },
    findUserById: async (userId) => {
        return await userModel.findOne({ _id: userId, status: 'active' }).select(getSelectData(['_id', 'fullName', 'email'])).lean();
    },
    findUserByGoogleId: async (googleId) => {
        return await userModel.findOne({ googleId }).select(getUnSelectData(['createdAt', 'updatedAt'])).lean();
    },
    findUserByFacebookId: async (facebookId) => {
        return await userModel.findOne({ facebookId }).select(getUnSelectData(['createdAt', 'updatedAt'])).lean();
    },
    updateUserById: async (userId, updateData) => {
        return await userModel.findByIdAndUpdate(userId, updateData, { new: true }).select(getUnSelectData(['createdAt', 'updatedAt'])).lean();
    }
};