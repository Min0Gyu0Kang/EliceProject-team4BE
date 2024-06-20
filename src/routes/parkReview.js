/**
File Name : parkReview
Description : 공원 리뷰 API - Route
Author : 이유민

History
Date        Author   Status    Description
2024.06.14  이유민   Created
2024.06.14  이유민   Modified  Park API 분리
2024.06.14  이유민   Modified  ES6 모듈로 변경
2024.06.15  이유민   Modified  리뷰 조회 추가
2024.06.16  이유민   Modified  id, user_id varchar로 변경
2024.06.16  이유민   Modified  API 문서 수정
2024.06.17  이유민   Modified  user -> users
2024.06.18  이유민   Modified  API 문서 수정
2024.06.18  이유민   Modified  status code 추가
2024.06.18  이유민   Modified  유효성 검사 추가
2024.06.19  이유민   Modified  토큰 확인 추가
2024.06.20  이유민   Modified  API 문서 수정
*/
import { Router } from 'express';
import ParkReviewService from '../services/parkReview.js';
import { BadRequest } from '../utils/errors.js';
import verifyAuthToken from '../utils/authToken.js';

const router = Router();

// 리뷰 작성
/**
 * @swagger
 * paths:
 *  /park-review/{park_id}:
 *   post:
 *    summary: "공원 리뷰 작성 API"
 *    tags:
 *    - Park-review
 *    description: "지정된 공원에 대한 리뷰 POST"
 *    parameters:
 *     - in: path
 *       name: park_id
 *       schema:
 *        type: integer
 *       required: true
 *       description: 공원 ID
 *     - in: header
 *       name: Authorization
 *       schema:
 *        type: string
 *       required: true
 *       description: 인증 토큰
 *     - in: body
 *       name: content
 *       schema:
 *        type: string
 *       required: true
 *       description: 리뷰 내용
 *     - in: body
 *       name: grade
 *       schema:
 *        type: integer
 *        format: int32
 *       required: true
 *       description: 리뷰 별점
 *    responses:
 *     201:
 *      description: 리뷰 작성 성공
 *      schema:
 *       properties:
 *        message:
 *         type: string
 *         example: 리뷰가 성공적으로 작성되었습니다.
 *     400:
 *       description: 잘못된 요청
 *       schema:
 *         type: object
 *         properties:
 *           error:
 *              type: string
 *              example: '잘못된 요청입니다.'
 *     401:
 *      description: 인증 실패
 *      schema:
 *       type: object
 *       properties:
 *        error:
 *         type: string
 *         example: '인증에 실패했습니다.'
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
router.post('/:park_id', verifyAuthToken, async (req, res, next) => {
    const { park_id } = req.params;
    const { content, grade } = req.body;
    const users_id = req.userId; // 회원가입, 로그인 구현 안 된 상태라 임의로 넣음
    try {
        // 유효성 검사
        if (!content || !grade) {
            throw new BadRequest();
        }
        if (content.length > 400) {
            throw new BadRequest();
        }
        if (content.includes("'")) {
            content = content.replaceAll("'", "''");
        }
        if (grade < 0 || grade > 5) {
            throw new BadRequest();
        }

        await ParkReviewService.addReview(park_id, users_id, content, grade);
        res.status(201).json({ message: '리뷰가 성공적으로 작성되었습니다.' });
    } catch (e) {
        next(e);
    }
});

// 리뷰 수정
/**
 * @swagger
 * paths:
 *  /park-review/{id}:
 *   put:
 *    summary: "공원 리뷰 수정 API"
 *    tags:
 *    - Park-review
 *    description: "리뷰 PUT"
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *        type: string
 *       required: true
 *       description: 해당 리뷰 ID
 *     - in: header
 *       name: Authorization
 *       schema:
 *        type: string
 *       required: true
 *       description: 인증 토큰
 *     - in: body
 *       name: content
 *       schema:
 *        type: string
 *       required: true
 *       description: 리뷰 내용
 *     - in: body
 *       name: grade
 *       schema:
 *        type: integer
 *        format: int32
 *       required: true
 *       description: 리뷰 별점
 *    responses:
 *     200:
 *      description: 리뷰 수정 성공
 *      schema:
 *       properties:
 *        message:
 *         type: string
 *         example: 리뷰가 성공적으로 수정되었습니다.
 *     400:
 *       description: 잘못된 요청
 *       schema:
 *         type: object
 *         properties:
 *           error:
 *              type: string
 *              example: 잘못된 요청입니다.
 *     401:
 *      description: 인증 실패
 *      schema:
 *       type: object
 *       properties:
 *        error:
 *         type: string
 *         example: '인증에 실패했습니다.'
 *     403:
 *      description: 권한 없음
 *      schema:
 *       type: object
 *       properties:
 *        error:
 *         type: string
 *         example: '권한이 없습니다.'
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
router.put('/:id', verifyAuthToken, async (req, res, next) => {
    const { id } = req.params;
    const { content, grade } = req.body;
    const users_id = req.userId;
    try {
        // 유효성 검사
        if (!content || !grade) {
            throw new BadRequest();
        }
        if (content.length > 400) {
            throw new BadRequest();
        }
        if (content.includes("'")) {
            content = content.replaceAll("'", "''");
        }
        if (grade < 0 || grade > 5) {
            throw new BadRequest();
        }

        await ParkReviewService.updateReview(id, users_id, content, grade);
        res.json({ message: '리뷰가 성공적으로 변경되었습니다.' });
    } catch (e) {
        next(e);
    }
});

// 리뷰 삭제
/**
 * @swagger
 * paths:
 *  /park-review/{id}:
 *   delete:
 *    summary: "공원 리뷰 삭제 API"
 *    tags:
 *    - Park-review
 *    description: "리뷰 DELETE"
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *        type: string
 *       required: true
 *       description: 해당 리뷰 ID
 *     - in: header
 *       name: Authorization
 *       schema:
 *        type: string
 *       required: true
 *       description: 인증 토큰
 *    responses:
 *     200:
 *      description: 리뷰 삭제 성공
 *      schema:
 *       properties:
 *        message:
 *         type: string
 *         example: 리뷰가 성공적으로 삭제되었습니다.
 *     401:
 *      description: 인증 실패
 *      schema:
 *       type: object
 *       properties:
 *        error:
 *         type: string
 *         example: '인증에 실패했습니다.'
 *     403:
 *      description: 권한 없음
 *      schema:
 *       type: object
 *       properties:
 *        error:
 *         type: string
 *         example: '권한이 없습니다.'
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
router.delete('/:id', verifyAuthToken, async (req, res, next) => {
    const { id } = req.params;
    const users_id = req.userId;
    try {
        await ParkReviewService.deleteReview(id, users_id);
        res.json({ message: '리뷰가 성공적으로 삭제되었습니다.' });
    } catch (e) {
        next(e);
    }
});

// 리뷰 조회
/**
 * @swagger
 * paths:
 *  /park-review/{id}:
 *   get:
 *    summary: "공원 리뷰 조회 API"
 *    tags:
 *    - Park-review
 *    description: "공원 리뷰 정보 GET"
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *        type: string
 *       required: true
 *       description: 리뷰 ID
 *    responses:
 *     200:
 *      description: 정보 조회 성공
 *      schema:
 *       properties:
 *        content:
 *         type: string
 *         description: 리뷰 내용
 *        grade:
 *         type: integer
 *         format: int32
 *         description: 별점
 *        nickname:
 *         type: string
 *         description: 리뷰 작성자 닉네임
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
router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await ParkReviewService.getReviewById(id);
        res.json(result);
    } catch (e) {
        next(e);
    }
});

// 해당 공원의 리뷰 상세보기
/**
 * @swagger
 * paths:
 *  /park-review/details/{park_id}:
 *   get:
 *    summary: "공원 리뷰 상세보기 API"
 *    tags:
 *    - Park-review
 *    description: "공원 리뷰 상세 정보 GET"
 *    parameters:
 *     - in: path
 *       name: park_id
 *       schema:
 *        type: integer
 *       required: true
 *       description: 공원 ID
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
 *           average_review:
 *            type: number
 *            format: float
 *            description: 평균 별점
 *        review:
 *         type: array
 *         items:
 *          type: object
 *          properties:
 *           nickname:
 *            type: string
 *            description: 리뷰 작성자 닉네임
 *           grade:
 *            type: integer
 *            format: int32
 *            description: 별점
 *           content:
 *            type: string
 *            description: 공원 후기 내용
 *           review_id:
 *            type: string
 *            description: 리뷰 고유 ID
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
router.get('/details/:park_id', async (req, res, next) => {
    const { park_id } = req.params;
    try {
        const park = await ParkReviewService.getReview(park_id);
        const review = await ParkReviewService.getReviewDetail(park_id);
        res.json({ park, review });
    } catch (e) {
        next(e);
    }
});

export default router;
