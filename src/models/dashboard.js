/**
File Name : dashboard
Description : 대시보드 차트 API - Model
Author : 박수정

History
Date        Author   Status    Description
2024.06.14  박수정   Created
2024.06.14  이유민   Modified  Linebar, Tinybar 추가
*/
const db = require('../models/psql');

class dashboardModel {
    static async readLinebar() {
        return await db.query(`
            SELECT a.year, AVG(a.park_area_per_capita) as capita, AVG(b.satisfaction) as satisfaction 
            FROM public."park_area_per_capita" AS a 
            LEFT JOIN public."green_space_satisfaction" AS b 
            ON a.year = b.year 
            GROUP BY a.year 
            ORDER BY a.year;
            `);
    }

    static async readTinybar() {
        return await db.query(`
            SELECT is_old, will_be_old_in_10_years FROM public."park_oldness_rate";
            `);
    }
}

module.exports = { dashboardModel };
