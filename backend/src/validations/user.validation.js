const Joi = require("joi");

const updateProfile = {
  body: Joi.object({
    fullName: Joi.string().trim().min(3).max(30).messages({
      "string.base": "Tên người dùng phải là một chuỗi",
      "string.empty": "Tên người dùng không được để trống",
      "string.min": "Tên người dùng phải có ít nhất {#limit} ký tự",
      "string.max": "Tên người dùng không được vượt quá {#limit} ký tự",
    }),
    phone: Joi.string()
      .trim()
      .pattern(/^[0-9]{10,15}$/)
      .messages({
        "string.base": "Số điện thoại phải là một chuỗi",
        "string.empty": "Số điện thoại không được để trống",
        "string.pattern.base": "Số điện thoại phải gồm từ 10 đến 15 chữ số",
      }),
    address: Joi.string().trim().max(255).messages({
      "string.base": "Địa chỉ phải là một chuỗi",
      "string.empty": "Địa chỉ không được để trống",
      "string.max": "Địa chỉ không được vượt quá {#limit} ký tự",
    }),
  })
    .unknown(false)
    .min(1)
    .messages({
      "object.min": "Cần ít nhất một trường để cập nhật",
      "object.unknown": "Trường {#label} không được phép cập nhật",
    }),
};

const changePassword = {
  body: Joi.object({
    oldPassword: Joi.string().min(6).max(20).required().messages({
      "string.base": "Mật khẩu hiện tại phải là một chuỗi",
      "string.empty": "Mật khẩu hiện tại không được để trống",
      "string.min": "Mật khẩu hiện tại phải có ít nhất {#limit} ký tự",
      "string.max": "Mật khẩu hiện tại không được vượt quá {#limit} ký tự",
      "any.required": "Mật khẩu hiện tại là bắt buộc",
    }),
    newPassword: Joi.string().min(6).max(20).required().messages({
      "string.base": "Mật khẩu mới phải là một chuỗi",
      "string.empty": "Mật khẩu mới không được để trống",
      "string.min": "Mật khẩu mới phải có ít nhất {#limit} ký tự",
      "string.max": "Mật khẩu mới không được vượt quá {#limit} ký tự",
      "any.required": "Mật khẩu mới là bắt buộc",
    }),
    repeatPassword: Joi.string()
      .valid(Joi.ref("newPassword"))
      .required()
      .messages({
        "any.only": "Xác nhận mật khẩu mới không khớp",
        "string.empty": "Xác nhận mật khẩu mới không được để trống",
        "any.required": "Xác nhận mật khẩu mới là bắt buộc",
      }),
  })
    .unknown(false)
    .messages({
      "object.unknown": "Trường {#label} không được phép gửi lên",
    }),
};

module.exports = {
  updateProfile,
  changePassword,
};
