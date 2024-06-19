/**File Name : userAuth
Description : 회원 API - Route
Author : 박수정

History
Date        Author   Status     Description
2024.06.15  박수정   Created
2024.06.15  박수정   Modified   회원가입 및 로그인 API 추가
2024.06.16  박수정   Modified   아이디 및 비밀번호 찾기 API 추가
2024.06.17  박수정   Modified   회원 관련 API 수정
*/

import { Router } from 'express';
import UserAuthService from '../services/userAuth.js';
import { BadRequest } from '../utils/errors.js';

const router = Router();

// 회원가입
/**
 * @swagger
 * paths:
 *  /users/signup:
 *   post:
 *    summary: '회원가입 API'
 *    tags:
 *    - userAuth
 *    description: '회원가입 요청'
 *    parameters:
 *    - in: body
 *      name: user
 *      description: 유저 정보
 *      schema:
 *       type: object
 *       required:
 *        - name
 *        - nickname
 *        - email
 *        - password
 *        - confirmPassword
 *       properties:
 *        name:
 *         type: string
 *         description: 이름
 *        nickname:
 *         type: string
 *         description: 닉네임
 *        email:
 *         type: string
 *         description: 이메일
 *        password:
 *         type: string
 *         description: 비밀번호
 *        confirmPassword:
 *         type: string
 *         description: 비밀번호 확인
 *    responses:
 *     201:
 *      description: 회원가입 성공
 *      schema:
 *       type: object
 *       properties:
 *        message:
 *         type: string
 *         example: "회원가입이 성공적으로 완료되었습니다."
 *     400:
 *      description: 잘못된 요청 - 필수 필드 누락, 유효성 검사 실패 등
 *      schema:
 *       type: object
 *       properties:
 *        error:
 *         type: string
 *         example: '유효하지 않은 요청입니다.'
 *     409:
 *      description: 이미 존재하는 이메일
 *      schema:
 *       type: object
 *       properties:
 *        error:
 *         type: string
 *         example: '이미 존재하는 이메일입니다.'
 *     500:
 *      description: 서버 내부 오류
 *      schema:
 *       type: object
 *       properties:
 *        error:
 *          type: string
 *          example: "서버 내부 에러가 발생했습니다."
 */
router.post('/signup', async (req, res, next) => {
    try {
        const { name, nickname, email, password, confirmPassword } = req.body;

        // 입력하지 않은 데이터 확인
        if (!name || !nickname || !email || !password || !confirmPassword) {
            throw new BadRequest('입력하지 않은 데이터가 있습니다.');
        }

        await UserAuthService.signUp(name, nickname, email, password, confirmPassword);

        res.json({
            message: '회원가입이 성공적으로 완료되었습니다.',
        });
    } catch (e) {
        next(e);
    }
});

// 로그인
/**
 * @swagger
 * paths:
 *  /users/login:
 *   post:
 *    summary: '로그인 API'
 *    tags:
 *    - userAuth
 *    description: '로그인 요청'
 *    parameters:
 *    - in: body
 *      name: credentials
 *      description: 유저 인증 정보
 *      schema:
 *       type: object
 *       required:
 *        - email
 *        - password
 *       properties:
 *        email:
 *         type: string
 *         description: 이메일
 *        password:
 *         type: string
 *         description: 비밀번호
 *    responses:
 *     200:
 *      description: 로그인 성공
 *      schema:
 *       type: object
 *       properties:
 *        message:
 *         type: string
 *         example: "로그인이 성공적으로 수행되었습니다."
 *        accessToken:
 *         type: string
 *         description: JWT 액세스 토큰
 *        refreshToken:
 *         type: string
 *         description: JWT 리프레시 토큰
 *     400:
 *      description: 잘못된 요청 - 필수 필드 누락, 유효성 검사 실패 등
 *      schema:
 *       type: object
 *       properties:
 *        error:
 *         type: string
 *         example: '유효하지 않은 요청입니다.'
 *     401:
 *      description: 인증 실패
 *      schema:
 *       type: object
 *       properties:
 *        error:
 *         type: string
 *         example: '인증에 실패했습니다.'
 *     500:
 *      description: 서버 내부 오류
 *      schema:
 *       type: object
 *       properties:
 *        error:
 *          type: string
 *          example: "서버 내부 에러가 발생했습니다."
 */
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 입력하지 않은 데이터 확인
        if (!email || !password) {
            throw new BadRequest('아이디 및 비밀번호를 입력해주세요.');
        }

        const { accessToken, refreshToken } = await UserAuthService.login(email, password);

        res.json({
            message: '로그인에 성공하였습니다.',
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    } catch (e) {
        next(e);
    }
});

// Token 재발급
router.post('/reissue-token', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        // RefreshToken이 입력되었는지 확인
        if (!refreshToken) {
            throw new BadRequest('Refresh Token이 입력되지 않았습니다.');
        }

        // RefreshToken으로 AccessToken 재발급
        const newAccessToken = await UserAuthService.refreshAccessToken(refreshToken);

        res.json({
            message: '새로운 Token이 발급되었습니다.',
            token: newAccessToken,
        });
    } catch (e) {
        next(e);
    }
});

// 로그아웃
/**
 * @swagger
 * paths:
 *  /users/logout:
 *   post:
 *    summary: '로그아웃 API'
 *    tags:
 *    - userAuth
 *    description: '로그아웃 요청'
 *    parameters:
 *    - in: body
 *      name: refreshToken
 *      description: Refresh Token
 *      required: true
 *      schema:
 *       type: object
 *       properties:
 *        refreshToken:
 *         type: string
 *         description: Refresh Token
 *    responses:
 *     200:
 *      description: 로그아웃 성공
 *      schema:
 *       type: object
 *       properties:
 *        message:
 *         type: string
 *         example: '로그아웃 되었습니다.'
 *     400:
 *      description: 잘못된 요청 - 필수 필드 누락, 유효성 검사 실패 등
 *      schema:
 *       type: object
 *       properties:
 *        error:
 *         type: string
 *         example: '유효하지 않은 요청입니다.'
 *     401:
 *      description: 인증 실패
 *      schema:
 *       type: object
 *       properties:
 *        error:
 *         type: string
 *         example: '인증에 실패했습니다.'
 *     500:
 *      description: 서버 내부 오류
 *      schema:
 *       type: object
 *       properties:
 *        error:
 *          type: string
 *          example: "서버 내부 에러가 발생했습니다."
 */
router.post('/logout', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        // RefreshToken이 입력되었는지 확인
        if (!refreshToken) {
            throw new BadRequest('Refresh Token이 입력되지 않았습니다.');
        }

        await UserAuthService.logout(refreshToken);

        res.json({
            message: '로그아웃 되었습니다.',
        });
    } catch (e) {
        next(e);
    }
});

export default router;
