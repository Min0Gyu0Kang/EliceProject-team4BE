/**File Name : jwt
Description : JWT 미들웨어
Author : 박수정

History
Date        Author   Status     Description
2024.06.15  박수정   Created
2024.06.15  박수정   Modified   JWT 미들웨어 추가
2024.06.17  박수정   Modified   JWT 미들웨어 수정
*/
import jwt from 'jsonwebtoken';
import { Unauthorized } from '../utils/errors.js';

const verifyToken = (req, res, next) => {
    try {
        // 요청 헤더
        const authHeader = req.headers.authorization;

        // Token 유효성 검사
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Unauthorized('토큰이 존재하지 않습니다');
        }

        // 요청 헤더에서 Token 추출
        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        // req.userId = decoded.userId;

        next();
    } catch (e) {
        next(e);
    }
};

export default verifyToken;
