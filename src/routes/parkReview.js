/**
File Name : parkReview
Description : 공원 리뷰 API - Route
Author : 이유민

History
Date        Author   Status    Description
2024.06.14  이유민   Created
2024.06.14  이유민   Modified  Park API 분리
2024.06.14  이유민   Modified  ES6 모듈로 변경
*/
import { Router } from 'express';
import ParkReviewService from '../services/parkReview.js';

const router = Router();

// 리뷰 작성
/**
 * @swagger
 * paths:
 *  /park-review/{park_id}:
 *   post:
 *    summary: "공원 리뷰 작성 API"
 *    tags:
 *    - park-review
 *    description: "지정된 공원에 대한 리뷰 POST"
 *    parameters:
 *     - in: path
 *       name: park_id
 *       schema:
 *        type: integer
 *       required: true
 *       description: 공원 ID
 *    requestBody:
 *     required: true
 *     schema:
 *      properties:
 *       content:
 *        type: string
 *        description: 리뷰 내용
 *       grade:
 *        type: number
 *        description: 리뷰 별점
 *    responses:
 *     200:
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
router.post('/:park_id', async (req, res, next) => {
    const { park_id } = req.params;
    const { content, grade } = req.body;
    const user_id = 1; // 회원가입, 로그인 구현 안 된 상태라 임의로 넣음

    try {
        await ParkReviewService.addReview(park_id, user_id, content, grade);

        res.json({ message: '리뷰가 성공적으로 작성되었습니다.' });
    } catch (e) {
        next(e);
    }
});

// 리뷰 수정
/**
 * @swagger
 * paths:
 *  /park-review/{park_id}:
 *   put:
 *    summary: "공원 리뷰 수정 API"
 *    tags:
 *    - park-review
 *    description: "리뷰 PUT"
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *        type: integer
 *       required: true
 *       description: 해당 리뷰 ID
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
router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { content, grade } = req.body;
    try {
        await ParkReviewService.updateReview(id, content, grade);

        res.json({ message: '리뷰가 성공적으로 변경되었습니다.' });
    } catch (e) {
        next(e);
    }
});

// 리뷰 삭제
/**
 * @swagger
 * paths:
 *  /park-review/{park_id}:
 *   delete:
 *    summary: "공원 리뷰 삭제 API"
 *    tags:
 *    - park-review
 *    description: "리뷰 DELETE"
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *        type: integer
 *       required: true
 *       description: 해당 리뷰 ID
 *    responses:
 *     200:
 *      description: 리뷰 삭제 성공
 *      schema:
 *       properties:
 *        message:
 *         type: string
 *         example: 리뷰가 성공적으로 삭제되었습니다.
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
router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        await ParkReviewService.deleteReview(id);

        res.json({ message: '리뷰가 성공적으로 삭제되었습니다.' });
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
 *    - park-review
 *    description: "공원 리뷰 상세 정보 GET"
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
 *            type: string
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
