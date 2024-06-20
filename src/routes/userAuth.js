/**File Name : userAuth
Description : 회원 API - Route
Author : 박수정

History
Date        Author   Status     Description
2024.06.15  박수정   Created
2024.06.15  박수정   Modified   회원가입 및 로그인 API 추가
2024.06.16  박수정   Modified   이메일 및 비밀번호 찾기 API 추가
2024.06.17  박수정   Modified   회원가입 및 로그인 API 수정
2024.06.19  박수정   Modified   이메일 및 비밀번호 찾기 API 수정
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
 *    - User
 *    description: '회원가입 요청'
 *    parameters:
 *    - in: body
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
 *         example: "회원가입이 완료되었습니다."
 *     400:
 *      description: 잘못된 요청 - 필수 필드 누락, 유효성 검사 실패 등
 *      schema:
 *       type: object
 *       properties:
 *        error:
 *         type: string
 *         example: '잘못된 요청입니다.'
 *     409:
 *      description: 리소스 충돌
 *      schema:
 *       type: object
 *       properties:
 *        error:
 *         type: string
 *         example: '리소스 충돌이 발생했습니다.'
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

        res.status(201).json({
            message: '회원가입이 완료되었습니다.',
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
 *    - User
 *    description: '로그인 요청'
 *    parameters:
 *    - in: body
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
 *         example: "로그인에 성공하였습니다."
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
 *         example: '잘못된 요청입니다.'
 *     401:
 *      description: 인증 실패
 *      schema:
 *       type: object
 *       properties:
 *        error:
 *         type: string
 *         example: '인증되지 않은 요청입니다.'
 *     404:
 *      description: 요청한 리소스를 찾을 수 없음
 *      schema:
 *       type: object
 *       properties:
 *        error:
 *         type: string
 *         example: '요청한 리소스를 찾을 수 없습니다.'
 *     409:
 *      description: 리소스 충돌
 *      schema:
 *       type: object
 *       properties:
 *        error:
 *         type: string
 *         example: '리소스 충돌이 발생했습니다.'
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
            throw new BadRequest('이메일 및 비밀번호를 입력해주세요.');
        }

        const { accessToken, refreshToken } = await UserAuthService.login(email, password);

        res.status(200).json({
            message: '로그인에 성공하였습니다.',
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    } catch (e) {
        next(e);
    }
});

// AccessToken 재발급
router.post('/reissue-token', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        // RefreshToken 입력 유무 확인
        if (!refreshToken) {
            throw new BadRequest('RefreshToken이 입력되지 않았습니다.');
        }

        // RefreshToken으로 AccessToken 재발급
        const newAccessToken = await UserAuthService.refreshAccessToken(refreshToken);

        res.status(200).json({
            message: '새로운 AccessToken이 발급되었습니다.',
            token: newAccessToken,
        });
    } catch (e) {
        next(e);
    }
});

// 비밀번호 찾기
/**
 * @swagger
 * paths:
 *  /users/find-password:
 *   post:
 *    summary: '비밀번호 찾기 API'
 *    tags:
 *    - User
 *    description: 등록된 이름 및 이메일을 통해, 임시 비밀번호 발급 및 이메일 전송
 *    parameters:
 *    - in: body
 *      schema:
 *       type: object
 *       required:
 *        - name
 *        - email
 *       properties:
 *        name:
 *         type: string
 *         description: 이름
 *        email:
 *         type: string
 *         description: 이메일
 *    responses:
 *     200:
 *      description: 임시 비밀번호 발급 및 이메일 전송 성공
 *      schema:
 *       type: object
 *       properties:
 *        message:
 *         type: string
 *         example: '입력하신 이메일로 임시 비밀번호가 전송되었습니다.'
 *     400:
 *      description: 잘못된 요청 - 필수 필드 누락, 유효성 검사 실패 등
 *      schema:
 *       type: object
 *       properties:
 *        error:
 *         type: string
 *         example: '잘못된 요청입니다.'
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
 *          example: '서버 내부 에러가 발생했습니다.'
 */
router.post('/find-password', async (req, res, next) => {
    try {
        const { name, email } = req.body;

        // 입력하지 않은 데이터 확인
        if (!name || !email) {
            throw new BadRequest('이름 및 이메일을 입력해주세요.');
        }

        await UserAuthService.findPassword(name, email);

        res.json({
            message: '입력하신 이메일로 임시 비밀번호가 전송되었습니다.',
        });
    } catch (e) {
        next(e);
    }
});

export default router;
