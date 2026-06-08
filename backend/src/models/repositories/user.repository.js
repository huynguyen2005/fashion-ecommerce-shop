const { getUnSelectData, getSelectData } = require("../../utils");
const userModel = require("../user.model");

module.exports = {
    findUserByEmail: async (email) => {
        return await userModel.findOne({ email }).select(getUnSelectData(['createdAt', 'updatedAt'])).lean();
    },
    createNewUser: async ({ fullName, email, password }) => {
        return await userModel.create({ fullName, email, password });
    },
    findUserById: async (userId) => {
        return await userModel.findOne({ _id: userId, status: 'active' }).select(getSelectData(['_id', 'fullName', 'email'])).lean();
    }
};