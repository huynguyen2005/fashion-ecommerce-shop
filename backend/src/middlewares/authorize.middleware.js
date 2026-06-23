const { ForbiddenError } = require("../core/error.response");

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError(
        "Error: You do not have permission to perform this action",
      );
    }
    next();
  };
};

module.exports = { authorize };
