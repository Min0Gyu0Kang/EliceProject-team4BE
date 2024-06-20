/**File Name : verifyAuthToken
Description : AccessToken 검증 미들웨어
Author : 박수정

History
Date        Author   Status     Description
2024.06.15  박수정   Created
2024.06.15  박수정   Modified   AccessToken 검증 미들웨어 추가
2024.06.17  박수정   Modified   AccessToken 검증 미들웨어 수정
2024.06.18  박수정   Modified   AccessToken 검증 미들웨어 수정
*/
import jwt from 'jsonwebtoken';
import { Unauthorized } from './errors.js';

const verifyAuthToken = (req, res, next) => {
    try {
        // 요청 헤더
        const authHeader = req.headers.authorization;

        // Token 유효성 검사
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Unauthorized('AccessToken이 존재하지 않습니다');
        }

        // 요청 헤더에서 Token 추출
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decoded.id;

        next();
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            throw new Unauthorized('유효하지 않은 AccessToken입니다.');
        }
        next(e);
    }
};

export default verifyAuthToken;
