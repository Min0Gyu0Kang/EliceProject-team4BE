/**
File Name : community
Description : 커뮤니티 API - Route
Author : 이유민

History
Date        Author   Status    Description
2024.06.16  이유민   Created
2024.06.16  이유민   Modified  생성, 조회 추가
*/
import { Router } from 'express';
import CommunityService from '../services/community.js';

const router = Router();

// 게시글 생성
/**
 * @swagger
 * paths:
 *  /community:
 *   post:
 *    summary: "커뮤니티 게시글 작성 API"
 *    tags:
 *    - community
 *    description: "커뮤니티 게시글 POST"
 *    parameters:
 *     - in: body
 *       name: park_name
 *       schema:
 *        type: string
 *       required: true
 *       description: 공원명
 *     - in: body
 *       name: title
 *       schema:
 *        type: string
 *       required: true
 *       description: 게시글 제목
 *     - in: body
 *       name: content
 *       schema:
 *        type: string
 *       required: true
 *       description: 게시글 내용
 *    responses:
 *     200:
 *      description: 게시글 작성 성공
 *      schema:
 *       properties:
 *        message:
 *         type: string
 *         example: 게시글이 성공적으로 작성되었습니다.
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
import db from '../models/psql.js';
router.post('/', async (req, res, next) => {
    const { park_name, title, content } = req.body;
    const park_id = 1;
    const user_id = '123asdf'; // 임시(로그인 완성되면 변경 예정)
    try {
        const { rows } = await db.query(`
            SELECT id FROM public."park" WHERE name LIKE '%${park_name}%';
            `);
        console.log(rows[0].id);

        const result = await CommunityService.addPost(park_id, user_id, title, content);

        res.json({ message: '게시글이 성공적으로 작성되었습니다.' });
    } catch (e) {
        next(e);
    }
});

// 게시글 전체 조회
/**
 * @swagger
 * paths:
 *  /community:
 *   get:
 *    summary: "커뮤니티 게시글 전체 조회 API"
 *    tags:
 *    - community
 *    description: "커뮤니티 게시글 전체 정보 GET"
 *    responses:
 *     200:
 *      description: 정보 조회 성공
 *      schema:
 *       properties:
 *        row_num:
 *         type: integer
 *         format: int32
 *         description: 게시글 번호
 *        id:
 *         type: string
 *         description: 게시글 ID
 *        park_name:
 *         type: string
 *         description: 공원 이름
 *        nickname:
 *         type: string
 *         description: 게시글 작성자 닉네임
 *        created_at:
 *         type: string
 *         description: 게시글 작성일
 *     500:
 *       description: 서버 내부 오류
 *       schema:
 *         type: object
 *         properties:
 *           error:
 *              type: string
 *              example: '서버 내부 에러가 발생했습니다.'
 */
router.get('/', async (req, res, next) => {
    try {
        const result = await CommunityService.getPostAll();

        res.json(result);
    } catch (e) {
        next(e);
    }
});

// 게시글 조회
/**
 * @swagger
 * paths:
 *  /community/{id}:
 *   get:
 *    summary: "커뮤니티 게시글 조회 API"
 *    tags:
 *    - community
 *    description: "커뮤니티 게시글 정보 GET"
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *        type: string
 *       required: true
 *       description: 해당 게시글 ID
 *    responses:
 *     200:
 *      description: 정보 조회 성공
 *      schema:
 *       properties:
 *        title:
 *         type: string
 *         description: 게시글 제목
 *        content:
 *         type: string
 *         description: 게시글 내용
 *        nickname:
 *         type: string
 *         description: 게시글 작성자 닉네임
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
        const result = await CommunityService.getPostById(id);
        res.json(result);
    } catch (e) {
        next(e);
    }
});

// 민원 넣기
/**
 * @swagger
 * paths:
 *  /community/complaint/{name}:
 *   get:
 *    summary: "커뮤니티 민원 넣기 API"
 *    tags:
 *    - community
 *    description: "공원 담당 기관 정보 GET"
 *    parameters:
 *     - in: path
 *       name: name
 *       schema:
 *        type: string
 *       required: true
 *       description: 공원 이름
 *    responses:
 *     200:
 *      description: 정보 조회 성공
 *      schema:
 *       properties:
 *        name:
 *         type: string
 *         description: 공원 이름
 *        management:
 *         type: string
 *         description: 담당 기관
 *        link:
 *         type: string
 *         description: 담당 기관 URL
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
router.get('/complaint/:name', async (req, res, next) => {
    const { name } = req.params;
    try {
        const result = await CommunityService.getManagementByName(name);

        res.json(result);
    } catch (e) {
        next(e);
    }
});

export default router;
