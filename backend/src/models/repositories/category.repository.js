const categoryModel = require("../category.model");

module.exports = {
  findAllActiveCategories: async () => {
    return await categoryModel
      .find({ isActive: true, deletedAt: null })
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();
  },

  findActiveCategoryBySlug: async (slug) => {
    return await categoryModel
      .findOne({ slug, isActive: true, deletedAt: null })
      .select("-__v")
      .lean();
  },

  findCategoryByNameOrSlug: async ({ name, slug }) => {
    return categoryModel
      .findOne({
        $or: [{ name: { $regex: new RegExp(`^${name}$`, "i") } }, { slug }],
        deletedAt: null,
      })
      .lean();
  },

  findCategoryById: async (categoryId) => {
    return await categoryModel
      .findOne({ _id: categoryId, deletedAt: null })
      .lean();
  },

  createCategory: async (payload) => {
    return await categoryModel.create(payload);
  },

  updateCategoryById: async ({ categoryId, payload }) => {
    return await categoryModel
      .findOneAndUpdate(
        { _id: categoryId, deletedAt: null },
        { $set: payload },
        { new: true, runValidators: true },
      )
      .select("-__v")
      .lean();
  },

  softDeleteCategoryById: async (categoryId) => {
    return await categoryModel.updateOne(
      { _id: categoryId, deletedAt: null },
      { $set: { deletedAt: new Date() } },
    );
  },
};
