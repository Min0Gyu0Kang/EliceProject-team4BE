/**
File Name : dashboard
Description : 대시보드 차트 API - Model
Author : 박수정

History
Date        Author   Status    Description
2024.06.14  박수정   Created
2024.06.14  박수정   Modified  CommonJS 모듈에서 ES6 모듈로 변경
2024.06.14  박수정   Modified  Scatter API 분리 - routes, service, model
2024.06.14  이유민   Modified  Linebar, Tinybar 추가
2024.06.14  이유민   Modified  ES6 모듈로 변경
2024.06.14  이유민   Modified  class 형태로 변경
2024.06.15  박수정   Modified  전체적인 코드 통일
*/
import db from '../models/psql.js';

class DashboardModel {
    // Linebar
    static async getLinebar() {
        return await db.query(`
            SELECT a.year, AVG(a.park_area_per_capita) as capita, AVG(b.satisfaction) as satisfaction 
            FROM public."park_area_per_capita" AS a 
            LEFT JOIN public."green_space_satisfaction" AS b 
            ON a.year = b.year 
            GROUP BY a.year 
            ORDER BY a.year;
            `);
    }

    // Tinybar
    static async getTinybar() {
        return await db.query(`
            SELECT is_old, will_be_old_in_10_years FROM public."park_oldness_rate";
            `);
    }

    // Scatter
    static async getScatter() {
        return await db.query(`
            SELECT pr.city, pt.park_area_per_thousand, g.satisfaction
            FROM park_area_per_thousand pt
            JOIN green_space_satisfaction g
                ON g.year = 2022
                AND pt.park_legal_region_id = g.park_legal_region_id
            JOIN park_legal_region pr
                ON pt.park_legal_region_id = pr.id;
        `);
    }
}

export default DashboardModel;
