/**
File Name : dashboard
Description : 대시보드 차트 API
Author : 이유민

History
Date        Author   Status    Description
2024.06.08  이유민   Created
2024.06.08  이유민   Modified  Tinybar API 추가
2024.06.08  이유민   Modified  Linebar API 추가
2024.06.09  이유민   Modified  Tinybar API 수정
2024.06.11  박수정   Modified  대시보드 Scatter 차트 API 추가
2024.06.12  박수정   Modified  대시보드 Scatter 차트 API 수정
2024.06.12  이유민   Modified  Tinybar, Linebar API 수정
2024.06.13  박수정   Modified  API 문서 자동화 기능 추가
2024.06.13  이유민   Done      Tinybar API 수정
*/

const { Router } = require('express');
const db = require('../models/psql');

const router = Router();

// 1인당 공원 면적 대비 지역 별 녹지환경 만족도 API
/**
 * @swagger
 * paths:
 *  /dashboard/linebar:
 *   get:
 *    summary: "linebar 차트"
 *    tags:
 *    - dashboard
 *    description: "1인당 공원 면적 대비 지역 별 녹지환경 만족도 정보 GET"
 *    responses:
 *     200:
 *      description: 정보 조회 성공
 *      schema:
 *       properties:
 *        year:
 *         type: integer
 *         format: int32
 *         description: 연도
 *        capita:
 *         type: number
 *         format: float
 *         description: 해당 연도의 1인당 공원 면적
 *        satisfaction:
 *         type: number
 *         format: float
 *         description: 해당 연도의 녹지환경 만족도
 *        line:
 *         type: number
 *         format: float
 *         description: 첫 연도와 마지막 연도의 1인당 공원 면적
 *     500:
 *      description: 서버 오류
 *      schema:
 *       properties:
 *         message:
 *          type: string
 */
router.get('/linebar', async (req, res, next) => {
    try {
        const result = await db.query(`
          SELECT a.year, AVG(a.park_area_per_capita) as capita, AVG(b.satisfaction) as satisfaction 
          FROM public."park_area_per_capita" AS a 
          LEFT JOIN public."green_space_satisfaction" AS b 
          ON a.year = b.year 
          GROUP BY a.year 
          ORDER BY a.year;
          `);

        const resData = result.rows.map(data => {
            const item = {
                year: data.year,
                capita: Math.round(data.capita * 10) / 10,
            };

            // 녹지환경 만족도 있는 연도에만 만족도 추가
            if (data.year % 2 == 0) {
                item.satisfaction = Math.round(data.satisfaction * 100) / 100;
            }

            // 첫 연도와 마지막 연도에만 line 추가
            if (data.year === 2010 || data.year === 2022) {
                item.line = Math.round(data.capita * 10) / 10;
            }

            return item;
        });

        res.json(resData);
    } catch (e) {
        next(e);
    }
});

// 전국 공원의 노후화 비율 API
/**
 * @swagger
 * paths:
 *  /dashboard/tinybar:
 *   get:
 *    summary: "tinybar 차트"
 *    tags:
 *    - dashboard
 *    description: "전국 공원의 노후화 비율 정보 GET"
 *    responses:
 *     200:
 *      description: 정보 조회 성공
 *      schema:
 *       properties:
 *        name:
 *         type: string
 *         description: 해당 데이터의 이름
 *        percentage:
 *         type: number
 *         format: float
 *         description: 해당 데이터의 비율
 *        date:
 *         type: string
 *         description: 기준 날짜
 *     500:
 *      description: 서버 오류
 *      schema:
 *       properties:
 *         message:
 *          type: string
 */
router.get('/tinybar', async (req, res, next) => {
    function percentageCalc(data, filterValue, standard) {
        let res =
            data.filter(dt => (standard == 2034 ? dt.will_be_old_in_10_years == filterValue : dt.is_old == filterValue))
                .length / data.length;
        return parseFloat((res * 100).toFixed(2));
    }

    try {
        const result = await db.query(`SELECT is_old, will_be_old_in_10_years FROM public."park_oldness_rate";`);

        resData = [
            { name: '데이터 없음', percentage: percentageCalc(result.rows, 'N') },
            {
                name: '30년 이하',
                percentage: percentageCalc(result.rows, 'F'),
            },
            {
                name: '31년 이상',
                percentage: percentageCalc(result.rows, 'T'),
                date: '2024-06-08',
            },
            { name: '', percentage: 0.0 },
            {
                name: '31년 이상',
                percentage: percentageCalc(result.rows, 'T', 2034),
                date: '2034-06-08',
            },
        ];

        res.json(resData);
    } catch (e) {
        next(e);
    }
});

// 대시보드 산점도(Scatter) 차트 API
// 천 명당 공원 면적 대비 지역 별 녹지환경 만족도
/**
 * @swagger
 * paths:
 *  /dashboard/scatter:
 *   get:
 *    summary: 'Scatter 차트 API'
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
