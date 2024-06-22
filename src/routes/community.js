/**
File Name : community
Description : 커뮤니티 API - Route
Author : 이유민

History
Date        Author   Status    Description
2024.06.16  이유민   Created
2024.06.16  이유민   Modified  생성, 조회 추가
2024.06.17  이유민   Modified  user -> users
2024.06.18  이유민   Modified  status code 추가
2024.06.18  이유민   Modified  유효성 검사 추가
2024.06.18  이유민   Modified  이미지 업로드 수정
2024.06.19  이유민   Modified  토큰 확인 추가
2024.06.20  이유민   Modified  API 문서 수정
*/
import { Router } from 'express';
import CommunityService from '../services/community.js';
import ParkService from '../services/park.js';
import uploadSingleFile from '../utils/upload.js';
import verifyAuthToken from '../utils/verifyAuthToken.js';

const router = Router();

// 이름으로 공원 검색
// 갤러리 전체 조회
/**
 * @swagger
 * paths:
 *  /community/search/parkname:
 *   get:
 *    summary: "커뮤니티 공원 검색 API"
 *    tags:
 *    - Community
 *    description: "커뮤니티 게시글 생성, 갤러리 생성에서 사용될 공원ID GET"
 *    parameters:
 *     - in: query
 *       name: name
 *       schema:
 *        type: string
 *       required: true
 *       description: 공원 이름
 *     - in: header
 *       name: Authorization
 *       schema:
 *        type: string
 *       required: true
 *       description: 인증 토큰
 *    responses:
 *     200:
 *      description: 정보 조회 성공
 *      schema:
 *       properties:
 *        id:
 *         type: integer
 *         format: int32
 *         description: 공원 번호
 *        name:
 *         type: string
 *         description: 공원 이름
 *        address:
 *         type: string
 *         description: 공원 주소
 *     401:
 *      description: 인증 실패
 *      schema:
 *       type: object
 *       properties:
 *        error:
 *         type: string
 *         example: '인증에 실패했습니다.'
 *     500:
 *       description: 서버 내부 오류
 *       schema:
 *         type: object
 *         properties:
 *           error:
 *              type: string
 *              example: '서버 내부 에러가 발생했습니다.'
 */
router.get('/search/parkname', verifyAuthToken, async (req, res, next) => {
    const { name } = req.query;
    try {
        const result = await ParkService.getParkNameByName(name);
        res.json(result);
    } catch (e) {
        next(e);
    }
});

// 게시글 생성
/**
 * @swagger
 * paths:
 *  /community/board/{park_id}:
 *   post:
 *    summary: "커뮤니티 게시글 작성 API"
 *    tags:
 *    - Community-board
 *    description: "커뮤니티 게시글 POST"
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
 *     201:
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
router.post('/board/:park_id', verifyAuthToken, async (req, res, next) => {
    const { title, content } = req.body;
    const { park_id } = req.params;
    const users_id = req.userId;
    try {
        if (!park_id || !users_id || !title || !content) {
            throw new BadRequest();
        }

        await CommunityService.addPost(park_id, users_id, title, content);

        res.status(201).json({ message: '게시글이 성공적으로 작성되었습니다.' });
    } catch (e) {
        next(e);
    }
});

// 게시글 수정
/**
 * @swagger
 * paths:
 *  /community/board/{id}:
 *   put:
 *    summary: "커뮤니티 게시글 수정 API"
 *    tags:
 *    - Community-board
 *    description: "커뮤니티 게시글 PUT"
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *        type: string
 *       required: true
 *       description: 해당 게시글 ID
 *     - in: header
 *       name: Authorization
 *       schema:
 *        type: string
 *       required: true
 *       description: 인증 토큰
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
 *      description: 게시글 수정 성공
 *      schema:
 *       properties:
 *        message:
 *         type: string
 *         example: 게시글이 성공적으로 수정되었습니다.
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
router.put('/board/:id', verifyAuthToken, async (req, res, next) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const users_id = req.userId;
    try {
        if (!id || !users_id || !title || !content) {
            throw new BadRequest();
        }

        await CommunityService.updatePost(id, users_id, title, content);
        res.json({ message: '게시글이 성공적으로 변경되었습니다.' });
    } catch (e) {
        next(e);
    }
});

// 게시글 삭제
/**
 * @swagger
 * paths:
 *  /community/board/{id}:
 *   delete:
 *    summary: "커뮤니티 게시글 삭제 API"
 *    tags:
 *    - Community-board
 *    description: "커뮤니티 게시글 DELETE"
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *        type: string
 *       required: true
 *       description: 해당 게시글 ID
 *     - in: header
 *       name: Authorization
 *       schema:
 *        type: string
 *       required: true
 *       description: 인증 토큰
 *    responses:
 *     200:
 *      description: 게시글 삭제 성공
 *      schema:
 *       properties:
 *        message:
 *         type: string
 *         example: 게시글이 성공적으로 삭제되었습니다.
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
router.delete('/board/:id', verifyAuthToken, async (req, res, next) => {
    const { id } = req.params;
    const users_id = req.userId;
    try {
        await CommunityService.deletePost(id, users_id);
        res.json({ message: '게시글이 성공적으로 삭제되었습니다.' });
    } catch (e) {
        next(e);
    }
});

// 게시글 전체 조회
/**
 * @swagger
 * paths:
 *  /community/board:
 *   get:
 *    summary: "커뮤니티 게시글 전체 조회 API"
 *    tags:
 *    - Community-board
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
router.get('/board', async (req, res, next) => {
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
 *  /community/board/{id}:
 *   get:
 *    summary: "커뮤니티 게시글 조회 API"
 *    tags:
 *    - Community-board
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
 *        users_id:
 *         type: string
 *         description: 게시글 작성자 ID
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
router.get('/board/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await CommunityService.getPostById(id);
        res.json(result);
    } catch (e) {
        next(e);
    }
});

// 갤러리 생성
/**
 * @swagger
 * paths:
 *  /community/gallery/{park_id}:
 *   post:
 *    summary: "커뮤니티 갤러리 작성 API"
 *    tags:
 *    - Community-gallery
 *    description: "커뮤니티 갤러리 POST"
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
 *       name: file
 *       schema:
 *        type: string
 *       required: true
 *       description: 이미지 파일
 *     - in: body
 *       name: tags
 *       schema:
 *        type: string
 *       description: 태그
 *    responses:
 *     201:
 *      description: 갤러리 작성 성공
 *      schema:
 *       properties:
 *        message:
 *         type: string
 *         example: 갤러리가 성공적으로 작성되었습니다.
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
router.post('/gallery/:park_id', verifyAuthToken, uploadSingleFile(), async (req, res, next) => {
    const { tags } = req.body;
    const users_id = req.userId;
    const { park_id } = req.params;
    try {
        if (!park_id || !users_id || !req.file.filename) {
            throw new BadRequest();
        }

        await CommunityService.addGallery(park_id, users_id, req.file.filename, tags);
        res.status(201).json({ message: '갤러리가 성공적으로 작성되었습니다.' });
    } catch (e) {
        next(e);
    }
});

// 갤러리 수정
/**
 * @swagger
 * paths:
 *  /community/gallery/{id}:
 *   put:
 *    summary: "커뮤니티 갤러리 수정 API"
 *    tags:
 *    - Community-gallery
 *    description: "커뮤니티 갤러리 PUT"
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *        type: string
 *       required: true
 *       description: 해당 갤러리 ID
 *     - in: header
 *       name: Authorization
 *       schema:
 *        type: string
 *       required: true
 *       description: 인증 토큰
 *     - in: body
 *       name: file
 *       schema:
 *        type: string
 *       required: true
 *       description: 이미지 파일
 *     - in: body
 *       name: tags
 *       schema:
 *        type: string
 *       description: 태그
 *    responses:
 *     200:
 *      description: 게시글 수정 성공
 *      schema:
 *       properties:
 *        message:
 *         type: string
 *         example: 갤러리가 성공적으로 수정되었습니다.
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
router.put('/gallery/:id', verifyAuthToken, uploadSingleFile(), async (req, res, next) => {
    const { id } = req.params;
    const { tags } = req.body;
    const users_id = req.userId;
    try {
        if (!users_id || !req.file.filename) {
            throw new BadRequest();
        }

        await CommunityService.updateGallery(id, users_id, req.file.filename, tags);
        res.json({ message: '갤러리가 성공적으로 변경되었습니다.' });
    } catch (e) {
        next(e);
    }
});

// 갤러리 삭제
/**
 * @swagger
 * paths:
 *  /community/gallery/{id}:
 *   delete:
 *    summary: "커뮤니티 갤러리 삭제 API"
 *    tags:
 *    - Community-gallery
 *    description: "커뮤니티 갤러리 DELETE"
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *        type: string
 *       required: true
 *       description: 해당 갤러리 ID
 *     - in: header
 *       name: Authorization
 *       schema:
 *        type: string
 *       required: true
 *       description: 인증 토큰
 *    responses:
 *     200:
 *      description: 갤러리 삭제 성공
 *      schema:
 *       properties:
 *        message:
 *         type: string
 *         example: 갤러리가 성공적으로 삭제되었습니다.
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
router.delete('/gallery/:id', verifyAuthToken, async (req, res, next) => {
    const { id } = req.params;
    const users_id = req.userId;
    try {
        await CommunityService.deleteGallery(id, users_id);
        res.json({ message: '갤러리가 성공적으로 삭제되었습니다.' });
    } catch (e) {
        next(e);
    }
});

// 갤러리 전체 조회
/**
 * @swagger
 * paths:
 *  /community/gallery:
 *   get:
 *    summary: "커뮤니티 갤러리 전체 조회 API"
 *    tags:
 *    - Community-gallery
 *    description: "커뮤니티 갤러리 전체 정보 GET"
 *    responses:
 *     200:
 *      description: 정보 조회 성공
 *      schema:
 *       properties:
 *        id:
 *         type: integer
 *         format: int32
 *         description: 갤러리 번호
 *        nickname:
 *         type: string
 *         description: 갤러리 작성자 닉네임
 *        image:
 *         type: string
 *         description: 파일명
 *        hash_tag:
 *         type: string
 *         description: 갤러리 해시태그
 *     500:
 *       description: 서버 내부 오류
 *       schema:
 *         type: object
 *         properties:
 *           error:
 *              type: string
 *              example: '서버 내부 에러가 발생했습니다.'
 */
router.get('/gallery', async (req, res, next) => {
    try {
        const result = await CommunityService.getGalleryAll();
        res.json(result);
    } catch (e) {
        next(e);
    }
});

// 갤러리 조회
/**
 * @swagger
 * paths:
 *  /community/gallery/{id}:
 *   get:
 *    summary: "커뮤니티 갤러리 조회 API"
 *    tags:
 *    - Community-gallery
 *    description: "커뮤니티 갤러리 정보 GET"
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *        type: string
 *       required: true
 *       description: 해당 갤러리 ID
 *    responses:
 *     200:
 *      description: 정보 조회 성공
 *      schema:
 *       properties:
 *        nickname:
 *         type: string
 *         description: 갤러리 작성자 닉네임
 *        image:
 *         type: string
 *         description: 파일명
 *        hash_tag:
 *         type: string
 *         description: 갤러리 해시태그
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
router.get('/gallery/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await CommunityService.getGalleryById(id);
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
 *    - Community-complaint
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
