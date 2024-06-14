/**
File Name : park
Description : 공원 API - Route
Author : 이유민

History
Date        Author   Status    Description
2024.06.11  이유민   Created
2024.06.14  이유민   Modified  Park API 분리
2024.06.14  이유민   Modified  ES6 모듈로 변경
*/
import { Router } from 'express';
import ParkService from '../services/park.js';

const router = Router();

// 시도 정보 조회
/**
 * @swagger
 * paths:
 *  /park/recommend/city:
 *   get:
 *    summary: "시/도 조회 API"
 *    tags:
 *    - park
 *    description: "추천 공원 설정 시 사용될 행정구역(시/도) 정보 GET"
 *    responses:
 *     200:
 *      description: 정보 조회 성공
 *      schema:
 *       properties:
 *        city:
 *         type: string
 *         description: 행정구역(시/도)
 *     500:
 *      description: 서버 오류
 *      schema:
 *       properties:
 *         message:
 *          type: string
 *          example: 서버 내부에서 에러가 발생했습니다.
 */
router.get('/recommend/city', async (req, res, next) => {
    try {
        const result = await ParkService.getCity();

        res.json(result);
    } catch (e) {
        next(e);
    }
});

// 해당 시도별 시군구 정보 조회
/**
 * @swagger
 * paths:
 *  /park/recommend/city/{city}:
 *   get:
 *    summary: "시/도별 시군구 조회 API"
 *    tags:
 *    - park
 *    description: "추천 공원 설정 시 사용될 시군구 정보 GET"
 *    parameters:
 *     - in: path
 *       name: city
 *       schema:
 *        type: string
 *       required: true
 *    responses:
 *     200:
 *      description: 정보 조회 성공
 *      schema:
 *       properties:
 *        district:
 *         type: string
 *         description: 시군구
 *     500:
 *      description: 서버 오류
 *      schema:
 *       properties:
 *         message:
 *          type: string
 *          example: 서버 내부에서 에러가 발생했습니다.
 */
router.get('/recommend/city/:city', async (req, res, next) => {
    const { city } = req.params;
    try {
        const result = await ParkService.getDistrict(city);

        res.json(result);
    } catch (e) {
        next(e);
    }
});

// 추천 공원 검색
/**
 * @swagger
 * paths:
 *  /park/recommend:
 *   get:
 *    summary: "추천 공원 조회 API"
 *    tags:
 *    - park
 *    description: "추천 공원 정보 GET"
 *    parameters:
 *     - in: query
 *       name: city
 *       schema:
 *        type: string
 *       required: true
 *       description: 행정구역(시/도)
 *     - in: query
 *       name: district
 *       schema:
 *        type: string
 *       required: false
 *       description: 행정구역(시군구)
 *    responses:
 *     200:
 *      description: 정보 조회 성공
 *      schema:
 *       properties:
 *        id:
 *         type: integer
 *         format: int32
 *         description: 공원 ID
 *        name:
 *         type: string
 *         description: 공원명
 *        address:
 *         type: string
 *         description: 공원 주소
 *        average_review:
 *         type: number
 *         format: float
 *         description: 공원 평균 별점
 *     500:
 *      description: 서버 오류
 *      schema:
 *       properties:
 *         message:
 *          type: string
 *          example: 서버 내부에서 에러가 발생했습니다.
 */
router.get('/recommend', async (req, res, next) => {
    const { city, district } = req.query;
    const page = Number(req.query.page || 0); // 현재 페이지
    const perPage = 5; // 페이지 당 공원 수
    try {
        const result = await ParkService.getRecommendPark(city, district, perPage, page);
        res.json(result);
    } catch (e) {
        next(e);
    }
});

// 공원 이름 검색
/**
 * @swagger
 * paths:
 *  /park/search/{name}:
 *   get:
 *    summary: "공원 직접 검색 API"
 *    tags:
 *    - park
 *    description: "검색한 공원 정보 GET"
 *    parameters:
 *     - in: path
 *       name: name
 *       schema:
 *        type: string
 *       required: true
 *    responses:
 *     200:
 *      description: 정보 조회 성공
 *      schema:
 *       properties:
 *        id:
 *         type: integer
 *         format: int32
 *         description: 공원 ID
 *        name:
 *         type: string
 *         description: 공원명
 *        address:
 *         type: string
 *         description: 공원 주소
 *        average_review:
 *         type: number
 *         format: float
 *         description: 공원 평균 별점
 *     500:
 *      description: 서버 오류
 *      schema:
 *       properties:
 *         message:
 *          type: string
 *          example: 서버 내부에서 에러가 발생했습니다.
 */
router.get('/search/:name', async (req, res, next) => {
    const { name } = req.params;
    const page = Number(req.query.page || 0); // 현재 페이지
    const perPage = 5; // 페이지 당 공원 수
    try {
        const result = await ParkService.getParkByName(name, perPage, page);
        res.json(result);
    } catch (e) {
        next(e);
    }
});

// 공원 선택
/**
 * @swagger
 * paths:
 *  /park/information/{id}:
 *   get:
 *    summary: "한 공원의 정보 조회 API"
 *    tags:
 *    - park
 *    description: "선택한 공원 정보 GET"
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *        type: integer
 *       required: true
 *    responses:
 *     200:
 *      description: 정보 조회 성공
 *      schema:
 *       properties:
 *        park:
 *         type: array
 *         items:
 *          type: object
 *          properties:
 *           id:
 *            type: integer
 *            format: int32
 *            description: 공원 ID
 *           name:
 *            type: string
 *            description: 공원명
 *           type:
 *            type: string
 *            description: 공원 타입
 *           address:
 *            type: string
 *            description: 공원 주소
 *           phone_number:
 *            type: string
 *            description: 관리기관 전화번호
 *           average_review:
 *            type: integer
 *            description: 평균 별점
 *            format: int32
 *           count_review:
 *            type: integer
 *            format: int32
 *            description: 별점 수
 *        facilities:
 *         type: array
 *         items:
 *          type: object
 *          properties:
 *           id:
 *            type: integer
 *            format: int32
 *            description: 공원 ID
 *           category:
 *            type: string
 *            description: 보유시설 카테고리
 *           name:
 *            type: string
 *            description: 보유시설명
 *     500:
 *      description: 서버 오류
 *      schema:
 *       properties:
 *         message:
 *          type: string
 *          example: 서버 내부에서 에러가 발생했습니다.
 */
router.get('/information/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const park = await ParkService.getParkById(id);
        const facilities = await ParkService.getFacilities(id);

        res.json({ park, facilities });
    } catch (e) {
        next(e);
    }
});

export default router;
