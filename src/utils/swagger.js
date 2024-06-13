/**
File Name : swagger
Description : swagger 기본 코드
Author : 이유민

History
Date        Author   Status    Description
2024.06.08  이유민   Created
2024.06.08  이유민   Done      swagger 기본 코드 작성 완료
*/
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
