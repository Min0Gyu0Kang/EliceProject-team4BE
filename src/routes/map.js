/**File Name : map
Description : 지도 API
Author : 박수정

History
Date        Author   Status     Description
2024.06.13  박수정   Created
2024.06.13  박수정   Modified   지도 API 추가
2024.06.13  박수정   Modified   API 문서 자동화 기능 추가
2024.06.14  박수정   Modified  CommonJS 모듈에서 ES6 모듈로 변경
*/

import { Router } from 'express';
import db from '../models/psql.js';
import { BadRequest, NotFound } from '../utils/errors.js';

const router = Router();

// 지도 API
/**
 * @swagger
 * paths:
 *  /map:
 *   get:
 *    summary: '지도 API'
 *    tags:
 *    - dashboard
 *    description: '지도 API 정보 GET'
 *    responses:
 *     200:
 *      description: 정보 조회 성공
 *      schema:
 *       properties:
 *        name:
 *         type: string
 *         description: 공원명
 *        address:
 *         type: string
 *         description: 소재지 지번주소
 *        latitude:
 *         type: number
 *         format: double
 *         description: 위도
 *        longitude:
 *         type: number
 *         format: double
 *         description: 경도
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
router.get('/', async (req, res, next) => {
    try {
        const { rows } = await db.query(`
            SELECT p.name, pr.address, pr.latitude, pr.longitude
            FROM park p
            JOIN park_region pr
                ON p.park_region_id = pr.id
        `);

        // 쿼리에 대한 유효성 검사
        if (!rows || rows.length === 0) {
            return next(new NotFound());
        }

        const data = rows.map(row => {
            // 각 데이터에 대한 유효성 검사
            if (!row.name || !row.address || !row.latitude || !row.longitude) {
                return next(new BadRequest('데이터가 존재하지 않습니다.'));
            }

            return {
                name: row.name,
                address: row.address,
                latitude: row.latitude,
                longitude: row.longitude,
            };
        });

        res.json(data);
    } catch (e) {
        next(e);
    }
});

export default router;
