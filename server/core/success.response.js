const { StatusCode, ReasonStatusCode } = require('../utils/httpStatusCode');

class SuccessReponse {
    constructor({ message, status = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metadata = {} }) {
        this.message = !message ? reasonStatusCode : message;
        this.status = status;
        this.metadata = metadata;
    };

    send(res, headers = {}) {
        return res.status(this.status).json(this);
    };
};

class OK extends SuccessReponse {
    constructor({ message, metadata }) {
        super({ message, metadata });
    };
};

class Created extends SuccessReponse {
    constructor({ message, status = StatusCode.CREATED, reasonStatusCode = ReasonStatusCode.CREATED, metadata }) {
        super({ message, status, reasonStatusCode, metadata });
    };
};

module.exports = {
    OK,
    Created
};