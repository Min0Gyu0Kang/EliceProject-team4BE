const swaggerUi = require("swagger-ui-express");
const swaggereJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    info: {
      title: "UrbanOasis",
      version: "1.0.0",
      description: "UrbanOasis API 문서입니다.",
    },
    host: "localhost:3000",
    basePath: "/",
  },
  apis: ["./src/routes/*.js", "./src/swagger/*"],
};

const specs = swaggereJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
