/**
File Name : psql
Description : PostgreSQL DB 연동
Author : 이유민

History
Date        Author   Status    Description
2024.06.08  이유민   Created
2024.06.11  이유민   Modified  ssl 추가
2024.06.11  이유민   Done      DB 연동 완료
*/
const {Client} = require('pg');
require('dotenv').config();

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

client.connect(err => {
    if (err) {
        console.error('PostgreSQL 연결 에러:', err);
    } else {
        console.log('PostgreSQL 연결 성공');
    }
});

client.on('end', () => {
    console.log('PostgreSQL와의 연결이 끊겼습니다.');
});

module.exports = client;
