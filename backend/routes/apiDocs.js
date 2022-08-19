const express = require('express');
const swaggerUI = require('swagger-ui-express');
const swaggerDocs = require('../swagger.json');

const app = express();

app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

module.exports = app;
