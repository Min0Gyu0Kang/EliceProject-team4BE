const express = require('express');
const { swaggerUi, specs } = require('./utils/swagger');
require('dotenv').config();
const bodyParser = require('body-parser');

const dashboard = require('./routes/dashboard');
const dashboardScatter = require('./routes/dashboardScatter');

const app = express();

app.get('/', (req, res, next) => {
    res.send('Hello World');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/dashboard', dashboard);
app.use('/dashboard-scatter', dashboardScatter);

// 에러 처리
app.use((error, req, res, next) => {
    const { name, message, status, data } = error;
    if (status >= 500) {
        console.error(name, message);
        res.status(status).json({
            error: '서버 내부에서 에러가 발생하였습니다.',
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
