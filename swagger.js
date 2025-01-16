const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Employee Management System API",
    version: "1.0.0",
    description: "API for managing employee records",
  },
  servers: [
    {
      url: "http://localhost:5000/api",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./controllers/employeeController.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
