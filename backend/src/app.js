require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./configs/swagger.config");

const app = express();
const API_PREFIX = "/api/v1";
const DOCS_PATH = `${API_PREFIX}/docs`;

app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use(DOCS_PATH, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(API_PREFIX, require('./routes'));


//handling error
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

//error-handling middleware
app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        // stack: error.stack,
        message: error.message || 'Internal Server Error'
    });
});



module.exports = app;
