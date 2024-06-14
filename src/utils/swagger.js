/**
File Name : swagger
Description : swagger 기본 코드
Author : 이유민

History
Date        Author   Status     Description
2024.06.08  이유민   Created
2024.06.08  이유민   Done       swagger 기본 코드 작성 완료
2024.06.14  박수정   Modified   CommonJS 모듈에서 ES6 모듈로 변경
*/
import swaggerUi from 'swagger-ui-express';
import swaggereJsdoc from 'swagger-jsdoc';

const options = {
    swaggerDefinition: {
        info: {
            title: 'UrbanOasis',
            version: '1.0.0',
            description: 'UrbanOasis API 문서입니다.',
        },
        host: 'localhost:3000',
        basePath: '/',
    },
    apis: ['./src/routes/*.js', './src/swagger/*'],
};

const specs = swaggereJsdoc(options);

export { swaggerUi, specs };
