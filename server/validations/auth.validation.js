const Joi = require('joi');

const register = {
    body: Joi.object({
        fullName: Joi.string().min(3).max(30).required().messages({
            'string.base': 'Tên người dùng phải là một chuỗi',
            'string.empty': 'Tên người dùng không được để trống',
            'string.min': 'Tên người dùng phải có ít nhất {#limit} ký tự',
            'string.max': 'Tên người dùng không được vượt quá {#limit} ký tự',
            'any.required': 'Tên người dùng là bắt buộc'
        }),

        email: Joi.string().email().required().messages({
            'string.base': 'Email phải là một chuỗi',
            'string.empty': 'Email không được để trống',
            'string.email': 'Email không hợp lệ',
            'any.required': 'Email là bắt buộc'
        }),

        password: Joi.string().min(6).max(20).required().messages({
            'string.base': 'Mật khẩu phải là một chuỗi',
            'string.empty': 'Mật khẩu không được để trống',
            'string.min': 'Mật khẩu phải có ít nhất {#limit} ký tự',
            'string.max': 'Mật khẩu không được vượt quá {#limit} ký tự',
            'any.required': 'Mật khẩu là bắt buộc'
        }),

        repeatPassword: Joi.string()
            .valid(Joi.ref('password'))
            .required()
            .messages({
                'any.only': 'Mật khẩu không khớp',
                'string.empty': 'Xác nhận mật khẩu không được để trống',
                'any.required': 'Xác nhận mật khẩu là bắt buộc'
            }),
    })
};

const login = {
    body: Joi.object({
        email: Joi.string().email().required().messages({
            'string.base': 'Email phải là một chuỗi',
            'string.empty': 'Email không được để trống',
            'string.email': 'Email không hợp lệ',
        }),
        password: Joi.string().min(6).max(20).required().messages({
            'string.base': 'Mật khẩu phải là một chuỗi',
            'string.empty': 'Mật khẩu không được để trống',
            'string.min': 'Mật khẩu phải có ít nhất {#limit} ký tự',
            'string.max': 'Mật khẩu không được vượt quá {#limit} ký tự',
        }),
    }),
};

module.exports = {
    register,
    login
};