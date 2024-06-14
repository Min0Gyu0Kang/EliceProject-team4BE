/**
File Name : dashboard
Description : 대시보드 차트 API - Model
Author : 박수정

History
Date        Author   Status    Description
2024.06.14  박수정   Created
2024.06.14  박수정   Modified  CommonJS 모듈에서 ES6 모듈로 변경
2024.06.14  박수정   Modified  Scatter API 분리 - routes, service, model
*/

import db from '../models/psql.js';

// Scatter 차트 데이터
const getScatter = async () => {
    const { rows } = await db.query(`
        SELECT pr.city, pt.park_area_per_thousand, g.satisfaction
        FROM park_area_per_thousand pt
        JOIN green_space_satisfaction g
            ON g.year = 2022
            AND pt.park_legal_region_id = g.park_legal_region_id
        JOIN park_legal_region pr
            ON pt.park_legal_region_id = pr.id;
    `);

    return rows;
};

export { getScatter };
