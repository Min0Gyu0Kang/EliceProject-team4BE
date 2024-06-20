/**File Name : userManagement
Description : 회원 API - Route
Author : 박수정

History
Date        Author   Status     Description
2024.06.17  박수정   Created
2024.06.17  박수정   Modified   로그아웃 API 추가
2024.06.17  박수정   Modified   마이페이지, 회원정보 수정, 회원탈퇴 API 추가
2024.06.18  박수정   Modified   마이페이지, 회원정보 수정, 회원탈퇴 API 수정
*/

import { Router } from 'express';
import verifyAuthToken from '../utils/authToken.js';
import UserManagementService from '../services/userManagement.js';
import { BadRequest } from '../utils/errors.js';

const router = Router();

// 마이페이지: 회원 정보 조회
/**
 * @swagger
 * paths:
 *  /users/mypage:
 *   get:
 *    summary: '마이페이지 API'
 *    tags:
 *    - User
 *    description: 회원 정보 조회
 *    responses:
 *     200:
 *      description: 회원 정보 조회 성공
 *      schema:
 *       type: object
 *       properties:
 *        userInfo:
 *         type: object
 *         properties:
 *          name:
 *           type: string
 *          nickname:
 *           type: string
 *          email:
 *           type: string
 *     400:
 *      description: 잘못된 요청 - 필수 필드 누락, 유효성 검사 실패 등
 *      schema:
 *       type: object
 *       properties:
 *        error:
 *         type: string
 *         example: '잘못된 요청입니다.'
 *     500:
 *      description: 서버 내부 오류
 *      schema:
 *       type: object
 *       properties:
 *        error:
 *         type: string
 *         example: '서버 내부 에러가 발생했습니다.'
 */
router.get('/mypage', verifyAuthToken, async (req, res, next) => {
    try {
        const userId = req.userId;
        const userInfo = await UserManagementService.getUserInfo(userId);

        res.status(200).json({
            name: userInfo.name,
            nickname: userInfo.nickname,
            email: userInfo.email,
        });
    } catch (e) {
        next(e);
    }
});

// 회원정보 수정
/**
 * @swagger
 * paths:
 *  /users/update:
 *   put:
 *    summary: '회원정보 수정 API'
 *    tags:
 *    - User
 *    description: 회원 정보 수정
 *    parameters:
 *    - in: body
 *      schema:
 *       type: object
 *       properties:
 *        nickname:
 *         type: string
 *         description: '새로운 닉네임'
 *        password:
 *         type: string
 *         description: '기존 비밀번호'
 *        newPassword:
 *         type: string
 *         description: '새로운 비밀번호'
 *        confirmNewPassword:
 *         type: string
 *         description: '새로운 비밀번호 확인'
 *    responses:
 *     200:
 *      description: 회원정보 수정 성공
 *      schema:
 *       type: object
 *       properties:
 *        message:
 *         type: string
 *         example: '회원정보가 수정되었습니다.'
 *        name:
 *         type: string
 *        nickname:
 *         type: string
 *        email:
 *         type: string
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
 *         type: string
 *         example: '서버 내부 에러가 발생했습니다.'
 */
router.put('/update', verifyAuthToken, async (req, res, next) => {
    try {
        const userId = req.userId;
        const { nickname, password, newPassword, confirmNewPassword } = req.body;

        // 입력하지 않은 데이터 확인
        if (!nickname || !password) {
            throw new BadRequest('입력하지 않은 데이터가 있습니다.');
        }

        let newUserInfo;

        if ((newPassword && confirmNewPassword) || newPassword !== '' || confirmNewPassword !== '') {
            // 비밀번호를 변경하는 경우
            newUserInfo = await UserManagementService.updateUserInfoWithNewPassword(
                userId,
                nickname,
                password,
                newPassword,
                confirmNewPassword,
            );
        } else {
            // 비밀번호를 변경하지 않는 경우
            newUserInfo = await UserManagementService.updateUserInfoWithoutNewPassword(userId, nickname, password);
        }

        res.status(200).json({
            message: '회원정보가 수정되었습니다.',
        });
    } catch (e) {
        next(e);
    }
});

// 회원 탈퇴
/**
 * @swagger
 * paths:
 *  /users/withdraw:
 *   post:
 *    summary: '회원 탈퇴 API'
 *    tags:
 *    - User
 *    description: 회원 탈퇴
 *    parameters:
 *    - in: body
 *      schema:
 *       type: object
 *       properties:
 *        password:
 *         type: string
 *         description: '비밀번호'
 *    responses:
 *     200:
 *      description: 회원 탈퇴 성공
 *      schema:
 *       type: object
 *       properties:
 *        message:
 *         type: string
 *         example: '회원 탈퇴가 완료되었습니다.'
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
 *     500:
 *      description: 서버 내부 오류
 *      schema:
 *       type: object
 *       properties:
 *        error:
 *         type: string
 *         example: '서버 내부 에러가 발생했습니다.'
 */
router.post('/withdraw', verifyAuthToken, async (req, res, next) => {
    try {
        const userId = req.userId;
        const { password } = req.body;

        // 입력하지 않은 데이터 확인
        if (!password) {
            throw new BadRequest('입력하지 않은 데이터가 있습니다.');
        }

        await UserManagementService.withdraw(userId, password);

        res.status(200).json({
            message: '회원 탈퇴가 완료되었습니다.',
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
 *    - User
 *    description: '로그아웃 요청'
 *    parameters:
 *    - in: body
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
 *         example: '잘못된 요청입니다.'
 *     401:
 *      description: 인증 실패
 *      schema:
 *       type: object
 *       properties:
 *        error:
 *         type: string
 *         example: '인증되지 않은 요청입니다.'
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
            throw new BadRequest('RefreshToken이 입력되지 않았습니다.');
        }

        await UserManagementService.logout(refreshToken);

        res.status(200).json({
            message: '로그아웃 되었습니다.',
        });
    } catch (e) {
        next(e);
    }
});

export default router;
