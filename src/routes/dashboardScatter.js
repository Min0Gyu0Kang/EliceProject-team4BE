/**File Name : dashboardScatter
Description : 대시보드 산점도 차트 API
Author : 박수정

History
Date        Author   Status    Description
2024.06.10  박수정   Created
2024.06.11  박수정   Modified  대시보드 산점도 차트 API 수정
2024.06.12  박수정   Done  대시보드 산점도 차트 API 수정
*/

const { Router } = require('express');
const db = require('../models/psql');

const router = Router();

// 천명당 공원면적 대비 지역별 녹지환경 만족도 상관관계 조회
router.get('/', async (req, res, next) => {
    try {
        const { rows } = await db.query(`
            SELECT pr.city, pt.park_area_per_thousand, g.satisfaction
            FROM park_area_per_thousand pt
            JOIN green_space_satisfaction g
                ON g.year = 2022
                AND pt.park_legal_region_id = g.park_legal_region_id
            JOIN park_legal_region pr
                ON pt.park_legal_region_id = pr.id;
        `);

        // 쿼리에 대한 유효성 검사
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: 'Not Found' });
        }

        const data = rows.map(row => {
            // 각 데이터에 대한 유효성 검사
            if (!row.city || !row.park_area_per_thousand || !row.satisfaction) {
                return res.status(400).json({ error: '데이터가 존재하지 않습니다.' });
            }

            return {
                city: row.city,
                park_area_per_thousand: row.park_area_per_thousand,
                satisfaction: row.satisfaction,
            };
        });

        res.json(data);
    } catch (e) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
