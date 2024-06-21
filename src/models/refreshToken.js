/**File Name : refreshToken
Description : Refresh Token - Model
Author : 박수정

History
Date        Author   Status     Description
2024.06.15  박수정   Created
2024.06.15  박수정   Modified   Refresh Token 관련 코드 추가
2024.06.17  박수정   Modified   Refresh Token 관련 코드 수정
2024.06.18  박수정   Modified   Refresh Token 관련 코드 수정
2024.06.21  박수정   Modified   Refresh Token 관련 코드 수정
*/

import db from './psql.js';
// import bcrypt from 'bcrypt';

// RefreshToken 관련
class RefreshTokenModel {
    // RefreshToken 발급
    static async issueRefreshToken(userId, refreshToken) {
        // const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        const query = `
          INSERT INTO refresh_tokens (users_id, refresh_token)
          VALUES ($1, $2)
          RETURNING *
        `;
        // const values = [userId, hashedRefreshToken];
        const values = [userId, refreshToken];
        const result = await db.query(query, values);

        return result.rows[0];
    }

    // RefreshToken 유무 확인
    static async findRefreshToken(refreshToken) {
        // const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        const query = `
          SELECT users_id, refresh_token
          FROM refresh_tokens
          WHERE refresh_token = $1
            AND deleted_at IS NULL
        `;
        // const values = [hashedRefreshToken];
        const values = [refreshToken];
        const result = await db.query(query, values);

        return result.rows[0];
    }

    // User Id로 RefreshToken 확인
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

    // AccessToken 재발급일 기록
    static async updateAccessToken(refreshToken) {
        const query = `
        UPDATE refresh_tokens
        SET accesstoken_updated_at = CURRENT_TIMESTAMP
        WHERE refresh_token = $1
          RETURNING *
      `;
        const values = [refreshToken];
        const result = await db.query(query, values);

        return result.rows[0];
    }

    // refreshToken으로 RefreshToken 삭제
    static async deleteRefreshTokenByRefreshToken(refreshToken) {
        // const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        const query = `
          UPDATE refresh_tokens
          SET deleted_at = CURRENT_TIMESTAMP
          WHERE refresh_token = $1
          RETURNING *
        `;
        // const values = [hashedRefreshToken];
        const values = [refreshToken];
        const result = await db.query(query, values);

        return result.rows[0];
    }

    // refreshToken으로 RefreshToken 삭제
    static async deleteRefreshTokenByUserId(userId) {
        // const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        const query = `
          UPDATE refresh_tokens
          SET deleted_at = CURRENT_TIMESTAMP
          WHERE users_id = $1
          RETURNING *
        `;
        // const values = [hashedRefreshToken];
        const values = [userId];
        const result = await db.query(query, values);

        return result.rows[0];
    }
}

export default RefreshTokenModel;
