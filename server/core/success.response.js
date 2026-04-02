const { StatusCodes, ReasonPhrases } = require('http-status-codes');

class SuccessReponse {
    constructor({ message, status = StatusCodes.OK, reasonStatusCode = ReasonPhrases.OK, metadata = {} }) {
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
    constructor({ message, status = StatusCodes.CREATED, reasonStatusCode = ReasonPhrases.CREATED, metadata }) {
        super({ message, status, reasonStatusCode, metadata });
    };
};

module.exports = {
    OK,
    Created
};