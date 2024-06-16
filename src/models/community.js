/**
File Name : community
Description : 커뮤니티 API - Model
Author : 이유민

History
Date        Author   Status    Description
2024.06.16  이유민   Created
2024.06.16  이유민   Modified  생성, 조회 추가
*/
import db from '../models/psql.js';

class CommunityModel {
    // 게시글 생성
    static async createPost(id, park_id, user_id, title, content) {
        return await db.query(`
            INSERT INTO public."board_community" (id, park_id, user_id, title, content)
            VALUES ('${id}', ${park_id}, '${user_id}', '${title}', '${content}');
            `);
    }

    // 게시글 전체 조회
    static async readPostAll() {
        return await db.query(`
            SELECT ROW_NUMBER() OVER (ORDER BY community.id) AS row_num
            , community.id, park.name AS park_name, users.nickname
            , TO_CHAR(community.created_at, 'YYYY-MM-DD') AS created_at
            FROM public."board_community" AS community
            LEFT JOIN public."park" AS park
            ON community.park_id = park.id
            LEFT JOIN public."user" AS users
            ON community.user_id = users.id
            WHERE community.deleted_at IS NULL;
            `);
    }

    // 게시글 조회
    static async readPostById(id) {
        return await db.query(`
            SELECT community.title, community.content, users.nickname
            FROM public."board_community" AS community
            LEFT JOIN public."user" AS users
            ON community.user_id = users.id
            WHERE community.id = '${id}' AND community.deleted_at IS NULL;
            `);
    }

    // 민원 넣기
    static async readManagementByName(name) {
        return await db.query(`
            SELECT park.name, government.management_authority AS management, government.link
            FROM public."park" AS park
            LEFT JOIN public."local_government" AS government
            ON park.local_government_id = government.id
            WHERE park.name LIKE '%${name}%';
            `);
    }
}

export { CommunityModel };
