/**File Name : userAuth
Description : 회원 API - Refresh Token 관련 Model
Author : 박수정

History
Date        Author   Status     Description
2024.06.15  박수정   Created
2024.06.15  박수정   Modified   회원가입 및 로그인 API 추가
2024.06.17  박수정   Modified   회원 관련 API 수정
*/

import db from './psql.js';

// Refresh Token 관련
class RefreshTokenModel {
    // Refresh Token 발급
    static async issueRefreshToken(userId, refreshToken) {
        const query = `
          INSERT INTO refresh_tokens (users_id, refresh_token)
          VALUES ($1, $2)
          RETURNING *
        `;
        const values = [userId, refreshToken];
        const result = await db.query(query, values);

        return result.rows[0];
    }

    // Refresh Token 확인
    static async findRefreshToken(refreshToken) {
        const query = `
          SELECT users_id, refresh_token
          FROM refresh_tokens
          WHERE refresh_token = $1
            AND deleted_at IS NULL
        `;
        const values = [refreshToken];
        const result = await db.query(query, values);

        return result.rows[0];
    }

    // Refresh Token 확인2
    static async findRefreshTokenByUser(userId) {
        const query = `
        SELECT users_id, refresh_token
        FROM refresh_tokens
        WHERE users_id = $1
          AND deleted_at IS NULL
      `;
        const values = [userId];
        const result = await db.query(query, values);

        return result.rows[0];
    }

    // Refresh Token 재발급
    static async reissueRefreshToken(userId, newRefreshToken) {
        const query = `
        UPDATE refresh_tokens
        SET refresh_token = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE users_id = $1
        RETURNING *
      `;
        const values = [userId, newRefreshToken];
        const result = await db.query(query, values);

        return result.rows[0];
    }

    // Refresh Token 삭제
    static async deleteRefreshToken(refreshToken) {
        const query = `
          UPDATE refresh_tokens
          SET deleted_at = CURRENT_TIMESTAMP
          WHERE refresh_token = $1
          RETURNING *
        `;
        const values = [refreshToken];
        const result = await db.query(query, values);

        return result.rows[0];
    }
}

export default RefreshTokenModel;
