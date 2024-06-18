/**File Name : map
Description : 지도 API - Route
Author : 박수정

History
Date        Author   Status     Description
2024.06.13  박수정   Created
2024.06.13  박수정   Modified   공원 전체에 대한 지도 API 추가
2024.06.13  박수정   Modified   API 문서 자동화 기능 추가
2024.06.14  박수정   Modified   CommonJS 모듈에서 ES6 모듈로 변경
2024.06.15  박수정   Modified   지도 API 분리 - routes, service, model
2024.06.18  박수정   Modified   공원 1개에 대한 지도 API 추가
*/

import { Router } from 'express';
import MapService from '../services/map.js';
import { validateServiceData } from '../utils/validations.js';

const router = Router();

// 지도 API
/**
 * @swagger
 * paths:
 *  /map:
 *   get:
 *    summary: '공원 전체에 대한 지도 API'
 *    tags:
 *    - map
 *    description: '공원 전체에 대한 지도 API 정보 GET'
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
        const map = await MapService.getAllMap();

        // Service로부터 넘어온 데이터에 대한 유효성 검사
        validateServiceData(map);

        res.json(map);
    } catch (e) {
        next(e);
    }
});

/**
 * @swagger
 * paths:
 *  /map/{id}:
 *   get:
 *    summary: '공원 1개에 대한 지도 API'
 *    tags:
 *    - map
 *    description: '공원 1개에 대한 지도 API 정보 GET'
 *    parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: 공원 ID
 *      schema:
 *       type: integer
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
router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const map = await MapService.getOneMap(id);

        // Service로부터 넘어온 데이터에 대한 유효성 검사
        validateServiceData(map);

        res.json(map);
    } catch (e) {
        next(e);
    }
});

export default router;
