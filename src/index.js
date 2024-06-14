import express from 'express';
import { swaggerUi, specs } from './utils/swagger.js';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config();

import dashboard from './routes/dashboard.js';
import map from './routes/map.js';

const app = express();

app.get('/', (req, res, next) => {
    res.send('Hello World');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/dashboard', dashboard);
app.use('/map', map);

// 에러 처리
app.use((error, req, res, next) => {
    const { name, message, status, data } = error;
    console.error(error.stack);

    if (status >= 500) {
        console.error(name, message);
        res.status(status).json({
            error: '서버 내부에서 에러가 발생했습니다.',
            data,
        });
        return;
    }

    res.status(status).json({
        error: message,
        data,
    });
});

app.listen(process.env.PORT, () => {
    console.log(`server listening on port ${process.env.PORT}`);
});
