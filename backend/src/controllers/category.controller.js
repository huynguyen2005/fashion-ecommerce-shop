const { OK, Created } = require("../core/success.response");
const CategoryService = require("../services/category.service");

module.exports = {
  getCategories: async (req, res) => {
    new OK({
      message: "Get categories successfully",
      metadata: await CategoryService.getCategories(),
    }).send(res);
  },

  getCategoryBySlug: async (req, res) => {
    new OK({
      message: "Get category successfully",
      metadata: await CategoryService.getCategoryBySlug(req.params.slug),
    }).send(res);
  },

  createCategory: async (req, res) => {
    new Created({
      message: "Create category successfully",
      metadata: await CategoryService.createCategory({
        name: req.body.name,
        description: req.body.description,
        userId: req.user._id,
      }),
    }).send(res);
  },

  updateCategory: async (req, res) => {
    new OK({
      message: "Update category successfully",
      metadata: await CategoryService.updateCategory({
        categoryId: req.params.id,
        payload: req.body,
        userId: req.user._id,
      }),
    }).send(res);
  },

  deleteCategory: async (req, res) => {
    new OK({
      message: "Delete category successfully",
      metadata: await CategoryService.deleteCategory(req.params.id),
    }).send(res);
  },
};
