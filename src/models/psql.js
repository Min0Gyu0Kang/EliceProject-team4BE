/**
File Name : psql
Description : PostgreSQL DB 연동
Author : 이유민

History
Date        Author   Status    Description
2024.06.08  이유민   Created
2024.06.11  이유민   Modified  ssl 추가
2024.06.11  이유민   Done      DB 연동 완료
2024.06.14  박수정   Modified  CommonJS 모듈에서 ES6 모듈로 변경
*/
import pkg from 'pg';
import dotenv from 'dotenv';

const { Client } = pkg;
dotenv.config();

const MAX_RETRIES = 3;
let retryCount = 0;

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        require: true,
        rejectUnauthorized: false,
    },
});

client
    .connect()
    .then(() => {
        console.log('PostgreSQL 연결 성공');
    })
    .catch(err => {
        console.error('PostgreSQL 연결 에러:', err);
        retryCount++;
        if (retryCount <= MAX_RETRIES) {
            console.log(`다시 연결 중`);
            setTimeout(connectToDatabase, 3000); // 3초 후에 재시도
        } else {
            console.error(`Maximum retry attempts (${MAX_RETRIES}) reached. Could not connect to database.`);
        }
    });

client.on('end', () => {
    console.log('PostgreSQL와의 연결이 끊겼습니다.');
});

export default client;
