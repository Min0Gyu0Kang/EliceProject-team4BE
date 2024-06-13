/**File Name : dashboardScatter
Description : 대시보드 산점도 차트 API
Author : 박수정

History
Date        Author   Status     Description
2024.06.10  박수정   Created
2024.06.11  박수정   Modified   대시보드 산점도 차트 API 추가
2024.06.12  박수정   Modified   대시보드 산점도 차트 API 수정
2024.06.13  박수정   Modified   API 문서 자동화 기능 추가
*/

const { Router } = require('express');
const db = require('../models/psql');
const { BadRequest, NotFound } = require('../utils/errors');

const router = Router();

// 대시보드 산점도(Scatter) 차트 API
// 천 명당 공원 면적 대비 지역 별 녹지환경 만족도
/**
 * @swagger
 * paths:
 *  /dashboard/scatter:
 *   get:
 *    summary: 'scatter 차트'
 *    tags:
 *    - dashboard
 *    description: '천 명당 공원 면적 대비 지역 별 녹지환경 만족도 API 정보 GET'
 *    responses:
 *     200:
 *      description: 정보 조회 성공
 *      schema:
 *       properties:
 *        city:
 *         type: string
 *         description: 시도
 *        park_area_per_thousand:
 *         type: number
 *         format: float
 *         description: 2022년 천 명당 공원 면적
 *        satisfaction:
 *         type: number
 *         format: float
 *         description: 2022년 지역 별 녹지환경 만족도
 *     400:
 *      description: 잘못된 요청
 *      schema:
 *       type: object
 *       properties:
 *        error:
 *         type: string
 *         example: '데이터가 존재하지 않습니다.'
 *     404:
 *      description: 요청한 리소스를 찾을 수 없음
 *      schema:
 *       type: object
 *       properties:
 *        error:
 *         type: string
 *         example: '요청한 리소스를 찾을 수 없습니다.'
 *     500:
 *      description: 서버 내부 오류
 *      schema:
 *       type: object
 *       properties:
 *        error:
 *          type: string
 *          example: "서버 내부 에러가 발생했습니다."
 */
router.get('/scatter', async (req, res, next) => {
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
            return next(new NotFound());
        }

        const data = rows.map(row => {
            // 각 데이터에 대한 유효성 검사
            if (!row.city || !row.park_area_per_thousand || !row.satisfaction) {
                return next(new BadRequest('데이터가 존재하지 않습니다.'));
            }

            return {
                city: row.city,
                park_area_per_thousand: row.park_area_per_thousand,
                satisfaction: row.satisfaction,
            };
        });

        res.json(data);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
