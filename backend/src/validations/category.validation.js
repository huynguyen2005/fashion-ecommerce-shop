const Joi = require("joi");

const createCategory = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).required().messages({
      "string.base": "Tên danh mục phải là một chuỗi",
      "string.empty": "Tên danh mục không được để trống",
      "string.min": "Tên danh mục phải có ít nhất {#limit} ký tự",
      "string.max": "Tên danh mục không được vượt quá {#limit} ký tự",
      "any.required": "Tên danh mục là bắt buộc",
    }),
    description: Joi.string().trim().max(500).allow("").messages({
      "string.base": "Mô tả phải là một chuỗi",
      "string.max": "Mô tả không được vượt quá {#limit} ký tự",
    }),
  }),
};

const updateCategory = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).messages({
      "string.base": "Tên danh mục phải là một chuỗi",
      "string.empty": "Tên danh mục không được để trống",
      "string.min": "Tên danh mục phải có ít nhất {#limit} ký tự",
      "string.max": "Tên danh mục không được vượt quá {#limit} ký tự",
    }),
    description: Joi.string().trim().max(500).allow("").messages({
      "string.base": "Mô tả phải là một chuỗi",
      "string.max": "Mô tả không được vượt quá {#limit} ký tự",
    }),
    isActive: Joi.boolean().messages({
      "boolean.base": "Trạng thái phải là boolean",
    }),
  }),
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "string.pattern.base": "ID danh mục không hợp lệ",
        "any.required": "ID danh mục là bắt buộc",
      }),
  }),
};

module.exports = {
  createCategory,
  updateCategory,
};
