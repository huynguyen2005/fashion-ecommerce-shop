const { BadRequestError } = require('../core/error.response');

const validate = (schema) => (req, res, next) => {
    for (const key in schema) {
        const { value, error } = schema[key].validate(req[key], {
            abortEarly: false,  // return all errors 
            stripUnknown: true, // delete fields that are not in the schema
        });

        if (error) {
            const errors = error.details.map((detail) => ({
                field: detail.path.join('.'),
                message: detail.message,
            }));

            const err = new BadRequestError();
            err.message = errors;

            return next(err);
        }

        req[key] = value;
    }

    next();
};

module.exports = validate;