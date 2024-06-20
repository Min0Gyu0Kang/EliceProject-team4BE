/**File Name : userManagement
Description : 회원 API - Service
Author : 박수정

History
Date        Author   Status     Description
2024.06.17  박수정   Created
2024.06.17  박수정   Modified   로그아웃 API 추가
2024.06.17  박수정   Modified   마이페이지, 회원정보 수정, 회원탈퇴 API 추가
2024.06.18  박수정   Modified   마이페이지, 회원정보 수정, 회원탈퇴 API 수정
*/

import UserManagementModel from '../models/userManagement.js';
import RefreshTokenModel from '../models/refreshToken.js';
import bcrypt from 'bcrypt';
import { BadRequest, NotFound, Conflict, Unauthorized } from '../utils/errors.js';

class UserManagementService {
    // 마이페이지
    static async getUserInfo(userId) {
        const userInfo = await UserManagementModel.findUserById(userId);

        if (!userInfo) {
            throw new BadRequest('회원 정보를 찾을 수 없습니다.');
        }
        return userInfo;
    }

    // 회원정보 수정 - 비밀번호를 변경하는 경우
    static async updateUserInfoWithNewPassword(userId, nickname, password, newPassword, confirmNewPassword) {
        // 데이터 유효성 검사
        const userInfo = await UserManagementModel.findUserById(userId);
        if (!userInfo) {
            throw new NotFound('사용자 정보를 찾을 수 없습니다.');
        }

        // 닉네임 형식 검사
        const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,10}$/; // 2-10자 이내의 한글, 영문자, 숫자만 허용
        if (!nicknameRegex.test(nickname)) {
            throw new BadRequest('닉네임 형식이 올바르지 않습니다.');
        }

        // 이전 닉네임과의 동일 여부 확인
        if (nickname !== userInfo.nickname) {
            // 닉네임 중복 검사
            const isExistNickname = await UserManagementModel.findUserByNickname(nickname);
            if (isExistNickname) {
                throw new Conflict('이미 존재하는 닉네임입니다.');
            }
        }

        // 기존 비밀번호 일치 여부 확인
        const isMatchedPassword = await bcrypt.compare(password, userInfo.password);
        if (!isMatchedPassword) {
            throw new Unauthorized('기존 비밀번호가 틀렸습니다.');
        }

        // 비밀번호 형식 검사
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/; // 8자 이상 최소 1개의 영문자, 숫자 포함
        if (!passwordRegex.test(newPassword) || !passwordRegex.test(confirmNewPassword)) {
            throw new BadRequest('비밀번호를 숫자 포함 8자 이상으로 입력해주세요.');
        }

        // 비밀번호 일치 여부 확인
        if (newPassword !== confirmNewPassword) {
            throw new BadRequest('새로운 비밀번호가 서로 일치하지 않습니다.');
        }

        // 이전 비밀번호와의 동일 여부 확인
        if (password === newPassword) {
            throw new BadRequest('이전 비밀번호와 동일한 비밀번호입니다.');
        }

        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 회원정보 수정
        const newUserInfo = await UserManagementModel.updateUserInfoWithNewPassword(userId, nickname, hashedPassword);

        return newUserInfo;
    }

    // 회원정보 수정 - 비밀번호를 변경하지 않는 경우
    static async updateUserInfoWithoutNewPassword(userId, nickname, password) {
        // 데이터 유효성 검사
        const userInfo = await UserManagementModel.findUserById(userId);
        if (!userInfo) {
            throw new NotFound('사용자 정보를 찾을 수 없습니다.');
        }

        // 닉네임 형식 검사
        const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,10}$/; // 2-10자 이내의 한글, 영문자, 숫자만 허용
        if (!nicknameRegex.test(nickname)) {
            throw new BadRequest('닉네임 형식이 올바르지 않습니다.');
        }

        // 이전 닉네임과의 동일 여부 확인
        if (nickname !== userInfo.nickname) {
            // 닉네임 중복 검사
            const isExistNickname = await UserManagementModel.findUserByNickname(nickname);
            if (isExistNickname) {
                throw new Conflict('이미 존재하는 닉네임입니다.');
            }
        }

        // 기존 비밀번호 일치 여부 확인
        const isMatchedPassword = await bcrypt.compare(password, userInfo.password);
        if (!isMatchedPassword) {
            throw new Unauthorized('기존 비밀번호가 틀렸습니다.');
        }

        // 회원정보 수정
        const newUserInfo = await UserManagementModel.updateUserInfoWithoutNewPassword(userId, nickname);

        return newUserInfo;
    }

    // 회원 탈퇴
    static async withdraw(userId, password) {
        // 데이터 유효성 검사
        // 기존 비밀번호 일치 여부 확인
        const userInfo = await UserManagementModel.findUserById(userId);
        const isMatchedPassword = await bcrypt.compare(password, userInfo.password);
        if (!isMatchedPassword) {
            throw new Unauthorized('비밀번호가 틀렸습니다.');
        }

        await UserManagementModel.withdraw(userId);
    }

    // 로그아웃
    static async logout(refreshToken) {
        // 유효한 RefreshToken인지 확인
        const savedToken = await RefreshTokenModel.findRefreshToken(refreshToken);
        if (!savedToken) {
            throw new Unauthorized('유효하지 않은 RefreshToken입니다.');
        }

        await RefreshTokenModel.deleteRefreshToken(refreshToken);
    }
}

export default UserManagementService;
