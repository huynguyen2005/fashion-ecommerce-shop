const { generateSlug } = require("../helpers/string.helper");
const {
  findAllActiveCategories,
  findActiveCategoryBySlug,
  findCategoryById,
  createCategory,
  updateCategoryById,
  softDeleteCategoryById,
  findCategoryByNameOrSlug,
} = require("../models/repositories/category.repository");
const {
  ConflictError,
  NotFoundError,
  InternalServerError,
} = require("../core/error.response");
const CacheService = require("./cache.service");
const {
  CATEGORY_LIST,
  CATEGORY_DETAIL,
} = require("../constants/cache.constant");
const { clearCategoryCache } = require("../helpers/cache.helper");

class CategoryService {
  static getCategories = async () => {
    const categoriesCache = await CacheService.getCache(CATEGORY_LIST);
    if (categoriesCache) {
      return categoriesCache;
    }

    const categories = await findAllActiveCategories();

    await CacheService.setCache(CATEGORY_LIST, categories);

    return categories;
  };

  static getCategoryBySlug = async (slug) => {
    const categoryCache = await CacheService.getCache(CATEGORY_DETAIL(slug));
    if (categoryCache) {
      return categoryCache;
    }

    const category = await findActiveCategoryBySlug(slug);
    if (!category) {
      throw new NotFoundError("Error: Category not found");
    }

    await CacheService.setCache(CATEGORY_DETAIL(slug), category);

    return category;
  };

  static createCategory = async ({ name, description, userId }) => {
    const slug = generateSlug(name);

    const existCategory = await findCategoryByNameOrSlug({ name, slug });
    if (existCategory) {
      throw new ConflictError("Error: Category name or slug already exists");
    }

    const newCategory = await createCategory({
      name,
      slug,
      description: description || "",
      createdBy: userId,
      updatedBy: userId,
    });

    if (!newCategory) {
      throw new InternalServerError("Error: Category creation failed");
    }

    await CacheService.delCache(CATEGORY_LIST);

    return newCategory;
  };

  static updateCategory = async ({ categoryId, payload, userId }) => {
    const category = await findCategoryById(categoryId);
    if (!category) {
      throw new NotFoundError("Error: Category not found");
    }

    const updateData = {
      ...payload,
      updatedBy: userId,
    };

    if (payload.name && payload.name !== category.name) {
      const slug = generateSlug(payload.name);
      const existCategory = await findCategoryByNameOrSlug({
        name: payload.name,
        slug,
      });
      if (existCategory && String(existCategory._id) !== String(categoryId)) {
        throw new ConflictError("Error: Category name or slug already exists");
      }
      updateData.slug = slug;
    }

    const updatedCategory = await updateCategoryById({
      categoryId,
      payload: updateData,
    });

    if (!updatedCategory) {
      throw new InternalServerError("Error: Category update failed");
    }

    await clearCategoryCache(category.slug);

    return updatedCategory;
  };

  static deleteCategory = async (categoryId) => {
    const category = await findCategoryById(categoryId);
    if (!category) {
      throw new NotFoundError("Error: Category not found");
    }
    await softDeleteCategoryById(categoryId);

    await clearCategoryCache(category.slug);

    return true;
  };
}

module.exports = CategoryService;
