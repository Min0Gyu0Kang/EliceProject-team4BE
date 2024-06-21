/**File Name : userManagement
Description : 회원 API - Model
Author : 박수정

History
Date        Author   Status     Description
2024.06.17  박수정   Created
2024.06.17  박수정   Modified   로그아웃 API 추가
2024.06.17  박수정   Modified   마이페이지, 회원정보 수정, 회원탈퇴 API 추가
2024.06.18  박수정   Modified   마이페이지, 회원정보 수정, 회원탈퇴 API 수정
2024.06.21  박수정   Modified   제약 조건 추가
*/

import db from '../models/psql.js';

class UserManagementModel {
    // 아이디를 이용해 기존 회원 찾기
    static async findUserById(userId) {
        const query = `
            SELECT name, nickname, email, password
            FROM users
            WHERE id = $1
                AND deleted_at IS NULL
        `;
        const values = [userId];
        const result = await db.query(query, values);

        return result.rows[0];
    }

    // 닉네임을 이용해 기존 회원 찾기
    static async findUserByNickname(nickname) {
        const query = `
            SELECT nickname
            FROM users
            WHERE nickname = $1
                AND deleted_at IS NULL
        `;
        const values = [nickname];
        const result = await db.query(query, values);

        return result.rows[0];
    }

    // 회원정보 수정 - 비밀번호를 변경하는 경우
    static async updateUserInfoWithNewPassword(userId, nickname, password) {
        const query = `
            UPDATE users
            SET nickname = $2,
                password = $3,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
                AND deleted_at IS NULL
            RETURNING *
        `;
        const values = [userId, nickname, password];
        const result = await db.query(query, values);

        return result.rows[0];
    }

    // 회원정보 수정 - 비밀번호를 변경하지 않는 경우
    static async updateUserInfoWithoutNewPassword(userId, nickname) {
        const query = `
            UPDATE users
            SET nickname = $2,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
                AND deleted_at IS NULL
            RETURNING *
        `;
        const values = [userId, nickname];
        const result = await db.query(query, values);

        return result.rows[0];
    }

    // 회원 탈퇴
    static async withdraw(userId) {
        const query = `
            UPDATE users
            SET deleted_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `;
        const values = [userId];
        const result = await db.query(query, values);

        return result.rows[0];
    }
}

export default UserManagementModel;
