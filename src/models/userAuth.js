/**File Name : userAuth
Description : 회원 API - Model
Author : 박수정

History
Date        Author   Status     Description
2024.06.15  박수정   Created
2024.06.15  박수정   Modified   회원가입 및 로그인 API 추가
2024.06.16  박수정   Modified   아이디 및 비밀번호 찾기 API 추가
2024.06.17  박수정   Modified   회원가입 및 로그인 API 수정
2024.06.19  박수정   Modified   아이디 및 비밀번호 찾기 API 수정
*/

import db from '../models/psql.js';
import { nanoid } from 'nanoid';

// 회원 관련
class UserAuthModel {
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

    // 이메일을 이용해 기존 회원 찾기
    static async findUserByEmail(email) {
        const query = `
            SELECT id, email, password
            FROM users
            WHERE email = $1
                AND deleted_at IS NULL
        `;
        const values = [email];
        const result = await db.query(query, values);

        return result.rows[0];
    }

    // 아이디를 이용해 기존 회원 찾기
    static async findUserById(id) {
        const query = `
            SELECT id, email
            FROM users
            WHERE id = $1
        `;
        const values = [id];
        const result = await db.query(query, values);

        return result.rows[0];
    }

    // 회원가입
    static async signUp(name, nickname, email, password) {
        const id = nanoid(10);
        const query = `
            INSERT INTO users (id, name, nickname, email, password)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const values = [id, name, nickname, email, password];
        const result = await db.query(query, values);

        return result.rows[0];
    }
}

export default UserAuthModel;
