/**
File Name : community
Description : 커뮤니티 API - Model
Author : 이유민

History
Date        Author   Status    Description
2024.06.16  이유민   Created
2024.06.16  이유민   Modified  생성, 조회 추가
2024.06.17  이유민   Modified  user -> users
*/
import db from '../models/psql.js';

class CommunityModel {
    // 게시글 생성
    static async createBoard(id, park_id, users_id, title, content) {
        return await db.query(`
            INSERT INTO public."board_community" (id, park_id, users_id, title, content)
            VALUES ('${id}', ${park_id}, '${users_id}', '${title}', '${content}');
            `);
    }

    // 게시글 수정
    static async updateBoard(id, park_id, title, content) {
        return await db.query(`
            UPDATE public."board_community" 
            SET park_id = ${park_id}, title = '${title}', content = '${content}', updated_at = NOW()
            WHERE id = '${id}' AND deleted_at IS NULL;
            `);
    }

    // 게시글 삭제
    static async deleteBoard(id) {
        return await db.query(`
            UPDATE public."board_community" 
            SET deleted_at = NOW()
            WHERE id = '${id}' AND deleted_at IS NULL;
            `);
    }

    // 게시글 전체 조회
    static async readBoardAll() {
        return await db.query(`
            SELECT ROW_NUMBER() OVER (ORDER BY community.id) AS row_num
            , community.id, park.name AS park_name, users.nickname
            , TO_CHAR(community.created_at, 'YYYY-MM-DD') AS created_at
            FROM public."board_community" AS community
            LEFT JOIN public."park" AS park
            ON community.park_id = park.id
            LEFT JOIN public."users" AS users
            ON community.users_id = users.id
            WHERE community.deleted_at IS NULL;
            `);
    }

    // 게시글 조회
    static async readBoardById(id) {
        return await db.query(`
            SELECT community.title, community.content, users.nickname
            FROM public."board_community" AS community
            LEFT JOIN public."users" AS users
            ON community.users_id = users.id
            WHERE community.id = '${id}' AND community.deleted_at IS NULL;
            `);
    }

    // 갤러리 생성
    static async createGallery(id, park_id, users_id, image, tags) {
        return await db.query(`
            INSERT INTO public."board_gallery" (id, park_id, users_id, image, hash_tag)
            VALUES ('${id}', ${park_id}, '${users_id}', '${image}', '${tags}');
            `);
    }

    // 갤러리 수정
    static async updateGalleryById(id, park_id, users_id, image, tags) {
        return await db.query(`
            UPDATE public."board_gallery"
            SET park_id = ${park_id}, image = '${image}', hash_tag = '${tags}', updated_at = NOW()
            WHERE id = '${id}' AND users_id = '${users_id}' AND deleted_at IS NULL;
            `);
    }

    // 갤러리 삭제
    static async deleteGallery(id, users_id) {
        return await db.query(`
            UPDATE public."board_gallery"
            SET deleted_at = NOW()
            WHERE id = '${id}' AND users_id = '${users_id}' AND deleted_at IS NULL;
            `);
    }

    // 갤러리 전체 조회
    static async readGalleryAll() {
        return await db.query(`
            SELECT gallery.id, users.nickname, gallery.image, gallery.hash_tag
            FROM public."board_gallery" AS gallery
            LEFT JOIN public."users" AS users
            ON gallery.users_id = users.id
            WHERE gallery.deleted_at IS NULL;
            `);
    }

    // 갤러리 조회
    static async readGalleryById(id) {
        return await db.query(`
            SELECT users.nickname, gallery.image, gallery.hash_tag
            FROM public."board_gallery" AS gallery
            LEFT JOIN public."users" AS users
            ON gallery.users_id = users.id
            WHERE gallery.id = '${id}' AND gallery.deleted_at IS NULL;
            `);
    }

    // 갤러리 체크
    static async checkGalleryById(id) {
        return await db.query(`
            SELECT id
            FROM public."board_gallery"
            WHERE id = '${id}' AND deleted_at IS NULL;
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
