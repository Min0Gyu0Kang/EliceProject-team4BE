/**
File Name : park
Description : 공원 API - Route
Author : 이유민

History
Date        Author   Status    Description
2024.06.11  이유민   Created
2024.06.14  이유민   Modified  Park API 분리
2024.06.14  이유민   Modified  ES6 모듈로 변경
2024.06.14  이유민   Modified  추천 공원 facilities 추가
2024.06.17  이유민   Modified  공원 조회 수정
2024.06.17  이유민   Modified  user -> users
2024.06.18  이유민   Modified  페이지네이션 제거
2024.06.20  이유민   Modified  API 문서 수정
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
 *    - Park
 *    description: "추천 공원 설정 시 사용될 행정구역(시/도) 정보 GET"
 *    responses:
 *     200:
 *      description: 정보 조회 성공
 *      schema:
 *       properties:
 *        city:
 *         type: string
 *         description: 행정구역(시/도)
 *     404:
 *       description: 요청한 리소스를 찾을 수 없음
 *       schema:
 *         type: object
 *         properties:
 *           error:
 *              type: string
 *              example: '요청한 리소스를 찾을 수 없습니다.'
 *     500:
 *       description: 서버 내부 오류
 *       schema:
 *         type: object
 *         properties:
 *           error:
 *              type: string
 *              example: '서버 내부 에러가 발생했습니다.'
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
 *    - Park
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
 *     404:
 *       description: 요청한 리소스를 찾을 수 없음
 *       schema:
 *         type: object
 *         properties:
 *           error:
 *              type: string
 *              example: '요청한 리소스를 찾을 수 없습니다.'
 *     500:
 *       description: 서버 내부 오류
 *       schema:
 *         type: object
 *         properties:
 *           error:
 *              type: string
 *              example: '서버 내부 에러가 발생했습니다.'
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
 *    - Park
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
 *     - in: query
 *       name: facilities
 *       schema:
 *        type: string
 *       required: false
 *       description: 보유시설
 *    responses:
 *     200:
 *      description: 정보 조회 성공
 *      schema:
 *       properties:
 *        data:
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
 *           address:
 *            type: string
 *            description: 공원 주소
 *           latitude:
 *            type: number
 *            format: float
 *            description: 위도
 *           longitude:
 *            type: number
 *            format: float
 *            description: 경도
 *           average_review:
 *            type: number
 *            format: float
 *            description: 평균 별점
 *     500:
 *       description: 서버 내부 오류
 *       schema:
 *         type: object
 *         properties:
 *           error:
 *              type: string
 *              example: '서버 내부 에러가 발생했습니다.'
 */
router.get('/recommend', async (req, res, next) => {
    const { city, district } = req.query;
    const facilities = req.query.facilities ? req.query.facilities.split(',') : [];
    try {
        const result = await ParkService.getRecommendPark(city, district, facilities);
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
 *    - Park
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
 *        data:
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
 *           address:
 *            type: string
 *            description: 공원 주소
 *           latitude:
 *            type: number
 *            format: float
 *            description: 위도
 *           longitude:
 *            type: number
 *            format: float
 *            description: 경도
 *           average_review:
 *            type: number
 *            format: float
 *            description: 평균 별점
 *     400:
 *       description: 잘못된 요청
 *       schema:
 *         type: object
 *         properties:
 *           error:
 *              type: string
 *              example: '잘못된 요청입니다.'
 *     500:
 *       description: 서버 내부 오류
 *       schema:
 *         type: object
 *         properties:
 *           error:
 *              type: string
 *              example: '서버 내부 에러가 발생했습니다.'
 */
router.get('/search/:name', async (req, res, next) => {
    const { name } = req.params;
    try {
        const result = await ParkService.getParkByName(name);
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
 *    - Park
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
 *           category:
 *            type: string
 *            description: 보유시설 카테고리
 *           name:
 *            type: string
 *            description: 보유시설명
 *     404:
 *       description: 요청한 리소스를 찾을 수 없음
 *       schema:
 *         type: object
 *         properties:
 *           error:
 *              type: string
 *              example: '요청한 리소스를 찾을 수 없습니다.'
 *     500:
 *       description: 서버 내부 오류
 *       schema:
 *         type: object
 *         properties:
 *           error:
 *              type: string
 *              example: '서버 내부 에러가 발생했습니다.'
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
