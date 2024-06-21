/**File Name : userAuth
Description : 회원 API - Service
Author : 박수정

History
Date        Author   Status     Description
2024.06.15  박수정   Created
2024.06.15  박수정   Modified   회원가입 및 로그인 API 추가
2024.06.16  박수정   Modified   비밀번호 찾기 API 추가
2024.06.17  박수정   Modified   회원가입 및 로그인 API 수정
2024.06.19  박수정   Modified   비밀번호 찾기 API 수정
2024.06.21  박수정   Modified   비밀번호 찾기 API 수정
*/

import UserAuthModel from '../models/userAuth.js';
import RefreshTokenModel from '../models/refreshToken.js';
import { BadRequest, Unauthorized, NotFound, Conflict } from '../utils/errors.js';
import sendTempPasswordByEmail from '../utils/sendTempPasswordByEmail.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';

class UserAuthService {
    // 회원가입
    static async signUp(name, nickname, email, password, confirmPassword) {
        // 데이터 유효성 검사
        // 이름 형식 검사
        const nameRegex = /^([가-힣]{2,20}|[a-zA-Z]{2,20})$/; // 2-20자 이내의 한글만 또는 영문자만 허용
        if (!nameRegex.test(name)) {
            throw new BadRequest('이름 형식이 올바르지 않습니다.');
        }

        // 닉네임 형식 검사
        const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,10}$/; // 2-10자 이내의 한글, 영문자, 숫자만 허용
        if (!nicknameRegex.test(nickname)) {
            throw new BadRequest('닉네임 형식이 올바르지 않습니다.');
        }

        // 닉네임 중복 검사
        const isExistNickname = await UserAuthModel.findUserByNickname(nickname);
        if (isExistNickname) {
            throw new Conflict('이미 존재하는 닉네임입니다.');
        }

        // 이메일 형식 검사
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; // 영문자, 숫자, _, -, . 허용
        if (!emailRegex.test(email)) {
            throw new BadRequest('이메일 형식이 올바르지 않습니다.');
        }

        // 이메일 중복 검사
        const isExistEmail = await UserAuthModel.findUserByEmail(email);
        if (isExistEmail) {
            throw new Conflict('이미 존재하는 이메일입니다.');
        }

        // 비밀번호 형식 검사
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/; // 8자 이상 최소 1개의 영문자, 숫자 포함
        if (!passwordRegex.test(password) || !passwordRegex.test(confirmPassword)) {
            throw new BadRequest('비밀번호를 숫자 포함 8자 이상으로 입력해주세요.');
        }

        // 비밀번호 일치 여부 확인
        if (password !== confirmPassword) {
            throw new BadRequest('비밀번호가 일치하지 않습니다.');
        }

        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserAuthModel.signUp(name, nickname, email, hashedPassword);

        return newUser;
    }

    // 로그인
    static async login(email, password) {
        // 데이터 유효성 검사
        // 이메일 형식 검사
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; // 영문자, 숫자, _, -, . 허용
        if (!emailRegex.test(email)) {
            throw new BadRequest('이메일 형식이 올바르지 않습니다.');
        }

        // 이메일 존재 여부 확인
        const user = await UserAuthModel.findUserByEmail(email);
        if (user === undefined) {
            throw new NotFound('가입되지 않은 이메일입니다.');
        }

        // 비밀번호 일치 여부 확인
        const isMatchedPassword = await bcrypt.compare(password, user.password);
        if (!isMatchedPassword) {
            throw new Unauthorized('비밀번호가 틀렸습니다.');
        }

        // Token 존재 여부 확인
        const savedToken = await RefreshTokenModel.findRefreshTokenByUser(user.id);
        if (savedToken) {
            throw new Conflict('이미 로그인한 상태입니다.');
        }

        // Access Token 발급
        const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        });

        // Refresh Token 발급
        const refreshToken = jwt.sign({}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        });

        await RefreshTokenModel.issueRefreshToken(user.id, refreshToken);

        return { accessToken, refreshToken };
    }

    // AccessToken 재발급
    static async refreshAccessToken(refreshToken) {
        // 유효한 RefreshToken인지 확인
        const savedToken = await RefreshTokenModel.findRefreshToken(refreshToken);
        if (!savedToken) {
            throw new Unauthorized('유효하지 않은 RefreshToken입니다.');
        }

        // 회원 정보 조회
        const user = await UserAuthModel.findUserById(savedToken.users_id);
        if (!user) {
            throw new NotFound('사용자 정보를 찾을 수 없습니다.');
        }

        // Access Token 재발급
        const newAccessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        });

        // AccessToken 재발급일 기록
        await RefreshTokenModel.updateAccessToken(refreshToken);

        return { newAccessToken };
    }

    // 비밀번호 찾기
    static async findPassword(name, email) {
        // 데이터 유효성 검사
        // 이름 형식 검사
        const nameRegex = /^([가-힣]{2,20}|[a-zA-Z]{2,20})$/; // 2-20자 이내의 한글만 또는 영문자만 허용
        if (!nameRegex.test(name)) {
            throw new BadRequest('이름 형식이 올바르지 않습니다.');
        }

        // 이메일 형식 검사
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; // 영문자, 숫자, _, -, . 허용
        if (!emailRegex.test(email)) {
            throw new BadRequest('이메일 형식이 올바르지 않습니다.');
        }

        // 입력한 이름 및 이메일과 일치하는 데이터 존재 여부 확인
        const user = await UserAuthModel.findPassword(name, email);
        if (user === undefined) {
            throw new NotFound('일치하는 회원 정보를 찾을 수 없습니다.');
        }

        // 임시 비밀번호 발급
        const tempPassword = nanoid(6);

        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        await UserAuthModel.issueTempPassword(name, email, hashedPassword);

        // 이메일로 전송
        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: email,
            subject: '도시의 오아시스 - 임시 비밀번호 발급',
            text: `${name}님의 임시 비밀번호는 ${tempPassword} 입니다.`,
            html: `${name}님의 임시 비밀번호는 <strong>${tempPassword}</strong> 입니다.`,
        };

        await sendTempPasswordByEmail(mailOptions);
    }
}

export default UserAuthService;
